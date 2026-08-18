import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";
import { resetPassword } from "../api/endpoints";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        token,
        password,
        confirmPassword
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errors =
        err.response?.data?.errors;

      setError(
        errors?.join(", ") ||
        "This password reset link is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card">
        <h2>Password reset</h2>

        <div className="auth-success">
          Your password has been reset successfully.
          You can now sign in.
        </div>

        <div className="auth-footer">
          <Link to="/login">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Choose a new password</h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <PasswordInput
          id="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <PasswordInput
          id="password-confirm"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button
          className="auth-button"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : "Reset password"}
        </button>
      </form>
    </div>
  );
}