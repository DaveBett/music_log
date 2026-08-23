import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getReviews,
  getUserReviews,
  deleteReview
} from "../../api/endpoints";

import ReviewList from "../reviews/ReviewList";

export default function UserReviewSection({ username, editable = false }) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    loadReviews();
  }, [username, editable]);

  function handleEdit(review) {
    navigate(`/reviews/${review.id}/edit`);
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
        onEdit={editable ? handleEdit : undefined}
        onDelete={editable ? handleDelete : undefined}
      />
    </section>
  );
}