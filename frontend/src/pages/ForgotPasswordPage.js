import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/endpoints";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await forgotPassword(email);

      setMessage(response.message);
      setEmail("");
    } catch (err) {
      setError(
        "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot your password?</h2>
    
        <p>
          Enter the email address associated with your account
          and we'll send you a password reset link.
        </p>
    
        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}
  
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
  
        <input
          id="email-reset"
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
  
        <button
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Send reset link"}
        </button>
        
        <div className="auth-footer">
          <Link to="/login">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}