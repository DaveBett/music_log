import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingSlider from "../components/reviews/RatingSlider";

import "./ReviewsPage.css";

import {
  getReview,
  updateReview,
  getAlbumCoverUrl
} from "../api/endpoints";

export default function EditReviewPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        setLoading(true);
        setError("");
  
        const data = await getReview(reviewId);
  
        setReview(data);
  
        setTitle(data.title || "");
        setRating(data.rating ?? "");
        setBody(data.body || "");
  
      } catch (err) {
        console.error(err);
  
        setError("Unable to load review.");
      } finally {
        setLoading(false);
      }
    }
    loadReview();
  }, [reviewId]);


  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateReview(
        reviewId,
        title,
        rating,
        body
      );

      navigate("/profile");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to update review."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading review...</p>;
  }

  if (!review) {
    return (
      <p>
        {error || "Review not found."}
      </p>
    );
  }

  const entry = review.entry;

  const coverUrl = getAlbumCoverUrl(
    entry?.musicbrainz_id
  );

  return (
    <div className="new-review-page">

      <div className="review-album-header">

        {coverUrl && (
          <img
            className="review-cover-large"
            src={coverUrl}
            alt={`${entry.title} album cover`}
          />
        )}

        <div>
          <h1>{entry.title}</h1>

          <h3>
            {entry.artist}
            {entry.year && ` · ${entry.year}`}
          </h3>
        </div>

      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form
        className="review-editor"
        onSubmit={handleSubmit}
      >

        <label className="review-label">
          Review Title

          <input
            className="auth-input"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </label>

        <div className="review-label">
          <span>Rating</span>
          <RatingSlider value={rating} onChange={setRating} />
        </div>

        <label className="review-label">
          Review

          <textarea
            className="auth-input review-textarea"
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
            rows={10}
            required
          />
        </label>

        <div className="review-editor-actions">

          <button
            className="auth-button"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}