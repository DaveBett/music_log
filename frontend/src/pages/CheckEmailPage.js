import { useState } from "react";
import { Link } from "react-router-dom";

import { resendVerificationEmail } from "../api/endpoints";

import "./VerifyEmailPage.css";

export default function CheckEmailPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleResend(event) {
    event.preventDefault();

    try {
      setSending(true);
      setMessage("");
      setError("");

      const data = await resendVerificationEmail(email);

      setMessage(data.message);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Unable to resend the confirmation email."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="verify-email-page">
      <div className="verify-email-content">
        <h1>Check your email</h1>

        <p>
          We've sent you a confirmation email.
          Click the link inside it to activate
          your MusicLog account.
        </p>

        <p>
          Didn't receive it? You can request another
          confirmation email below.
        </p>

        {message && (
          <div className="success-banner">
            {message}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form className="check-form" onSubmit={handleResend}>
          <label className="review-label">
            Email address

            <input
              id="check-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>
          <div className="email-buttons">
            <button className="auth-button" type="submit" disabled={sending} >
              {sending
                ? "Sending..."
                : "Resend confirmation email"}
            </button>

            <Link to="/login" className="auth-button">Back to Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}