import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getReviews, getUserReviews, deleteReview } from "../../api/endpoints";
import ReviewsBrowser from "../reviews/ReviewsBrowser";

export default function UserReviewSection({ username, editable = false }) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backTo = editable ? "/profile?tab=reviews" : `/user/${username}?tab=reviews`;

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const data = editable ? await getReviews() : await getUserReviews(username);
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
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    try {
      setError("");
      await deleteReview(reviewId);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error("Unable to delete review:", err);
      setError(err.response?.data?.errors?.join(", ") || "Unable to delete review.");
    }
  }

  return (
    <ReviewsBrowser
      reviews={reviews}
      loading={loading}
      error={error}
      editable={editable}
      onEdit={editable ? handleEdit : undefined}
      onDelete={editable ? handleDelete : undefined}
      backTo={backTo}
      pageSize={6}
    />
  );
}