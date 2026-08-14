import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

import "./ErrorPage.css";

const errorMessages = {
  400: {
    title: "Bad Request",
    message: "The request could not be understood. Please check what you were trying to do and try again."
  },

  401: {
    title: "Unauthorized",
    message: "You need to be logged in to access this page."
  },

  403: {
    title: "Forbidden",
    message: "You don't have permission to access this page."
  },

  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or may have been moved."
  },

  500: {
    title: "Server Error",
    message: "Something went wrong on our server. Please try again later."
  }
};

export default function ErrorPage({ statusCode = 404 }) {
  const location = useLocation();

  const error =
    errorMessages[statusCode] || {
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again."
    };

  return (
    <>
      <Navbar />
      <main className="error-page">
        <div className="error-page-content">

          <span className="error-code">
            {statusCode}
          </span>

          <h1>{error.title}</h1>

          <p>{error.message}</p>

          <p className="error-path">
            {location.pathname}
          </p>

          <Link to="/" className="auth-button">
            Return Home
          </Link>

        </div>
      </main>
    </>
  );
}