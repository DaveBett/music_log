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
        await signIn(email, password, rememberMe);
      }

      if (isRegister) {
        navigate("/check-email");
      } else {
        navigate("/");
      }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{isRegister ? "Create account" : "Welcome back"}</h2>

      {error && <div className="auth-error">{error}</div>}

      {isRegister && (
        <input
          id="username"
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="on"
          required
        />
      )}

      <input
        id="email"
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="on"
        required
      />

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