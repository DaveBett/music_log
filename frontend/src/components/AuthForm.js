import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "./ui/PasswordInput";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
      
        await signUp(username, email, password);
      } else {
        await signIn(login, password, rememberMe);
      }

      if (isRegister) {
        navigate("/check-email");
      } else {
        navigate("/");
      }
      } catch (err) {
        if (err.response?.status === 401) {
          setError(
            "The email or password you entered is incorrect."
          );
        } else if (err.response?.status === 403) {
          setError(
            "Please confirm your email address before signing in."
          );
        } else if (
          err.response?.data?.errors
        ) {
          setError(
            err.response.data.errors.join(", ")
          );
        } else {
          setError(
            "Something went wrong. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{isRegister ? "Create account" : "Welcome back"}</h2>

      {error && <div className="auth-error">{error}</div>}

      {isRegister ? (
        <input
          id="email"
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      ) : (
        <input
          id="login"
          className="auth-input"
          type="text"
          placeholder="Username or email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          autoComplete="username"
          required
        />
      )}

      <PasswordInput
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isRegister ? "new-password" : "current-password"}
        required
      />

      {isRegister && (
        <PasswordInput
          id="password-confirm"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required>
           <small>Must contain at least 8 characters.</small>
        </PasswordInput>
      )}

      {!isRegister && (
        <>
          <div className="remember-row">
            <label className="switch">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="slider"></span>
            </label>
      
            <span className="remember-label">
              Remember me
            </span>
          </div>
      
          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </div>
        </>
      )}

      <button className="auth-button" disabled={loading}>
        {loading
          ? "Please wait..."
          : isRegister
          ? "Create account"
          : "Sign In"}
      </button>

      <div className="auth-footer">
        {isRegister ? (
          <>
            Already have an account? <Link to="/login">Sign In</Link>
          </>
        ) : (
          <>
            Don't have an account? <Link to="/register">Create one</Link>
          </>
        )}
      </div>
    </form>
  );
}