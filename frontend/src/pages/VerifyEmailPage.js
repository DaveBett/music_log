import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { verifyEmail } from "../api/endpoints";

import "./ErrorPage.css";
import "./VerifyEmailPage.css";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("The verification link is missing its token.");
        return;
      }

      try {
        const data = await verifyEmail(token);

        setStatus("success");
        setMessage(
          data.message ||
          "Your email has been verified successfully."
        );
      } catch (err) {
        console.error(err);

        setStatus("error");

        setMessage(
          err.response?.data?.error ||
          "Unable to verify your email address."
        );
      }
    }

    verify();
  }, [token]);

  return (
    <main className="verify-email-page">
      <div className="verify-email-content">

        {status === "loading" && (
          <div className="verify-page">
            <h1>Verifying your email</h1>

            <p>
              Please wait while we activate your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="verify-page">
            <h1>Email confirmed!</h1>

            <p>{message}</p>

            <Link to="/login" className="auth-button">
              Log in
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="verify-page">
            <h1>Verification failed</h1>

            <p>{message}</p>

            <Link to="/" className="auth-button">
              Return Home
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}