import { useEffect, useState } from "react";

import {
  getReviews,
  getUserReviews,
  deleteReview
} from "../../api/endpoints";

import ReviewList from "../reviews/ReviewList";

export default function UserReviewSection({
  username,
  editable = false
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [username, editable]);

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data = editable
        ? await getReviews()
        : await getUserReviews(username);

      setReviews(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(reviewId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteReview(reviewId);

      // Remove it immediately from the UI
      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== reviewId
        )
      );

    } catch (err) {
      console.error("Unable to delete review:", err);

      setError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to delete review."
      );
    }
  }

  if (loading) {
    return (
      <section className="user-review-section">
        <p>Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="user-review-section">
        <div className="error-banner">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="user-review-section">
      <div className="section-header">
        <h2>Reviews</h2>
      </div>

      <ReviewList
        reviews={reviews}
        editable={editable}
        onDelete={editable ? handleDelete : undefined}
      />
    </section>
  );
}