import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingSlider from "../components/reviews/RatingSlider";

import "./ReviewsPage.css";

import {
  get_entry,
  createReview,
  getAlbumCoverUrl
} from "../api/endpoints";

export default function NewReviewPage() {
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEntry() {
      if (!entryId) {
        setError("No album was selected.");
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        setError("");
  
        const data = await get_entry(entryId);
  
        setEntry(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load album.");
      } finally {
        setLoading(false);
      }
    }
    loadEntry();
  }, [entryId]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createReview(
        entryId,
        title,
        rating,
        body
      );

      navigate("/profile");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to save review."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading album...</p>;
  }

  if (!entry) {
    return <p>{error || "Album not found."}</p>;
  }

  const coverUrl = getAlbumCoverUrl(
    entry.musicbrainz_id
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

      <form className="review-editor" onSubmit={handleSubmit}>
        <label className="review-label">
          Review Title
          <input
            className="auth-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            required
          />
        </label>

        <button className="auth-button" type="submit" disabled={saving}>
          {saving ? "Publishing..." : "Publish Review"}
        </button>
      </form>
    </div>
  );
}