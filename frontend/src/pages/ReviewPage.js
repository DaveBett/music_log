import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  getReview,
  deleteReview,
  getAlbumCoverUrl
} from "../api/endpoints";

import CommentList from "../components/reviews/CommentList";
import RatingRing from "../components/reviews/RatingRing";

import "./ReviewsPage.css";

export default function ReviewPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        setLoading(true);
        setError("");
  
        const data = await getReview(reviewId);
  
        setReview(data);
      } catch (err) {
        console.error(err);
  
        setError(
          err.response?.data?.errors?.join(", ") ||
          "Unable to load review."
        );
      } finally {
        setLoading(false);
      }
    }
  
    loadReview();
  }, [reviewId]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteReview(review.id);

      navigate("/profile");
    } catch (err) {
      console.error(err);

      setError("Unable to delete review.");
    }
  }

  function handleGoBack() {
    const fallbackTo = review?.is_owner
      ? "/profile?tab=reviews"
      : `/user/${review?.user?.username}?tab=reviews`;
  
    const to = location.state?.from || fallbackTo;
  
    navigate(to);
  }

  if (loading) {
    return <p>Loading review...</p>;
  }

  if (error) {
    return (
      <div className="reviews-page">
        <div className="error-banner">
          {error}
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="reviews-page">
        <p>Review not found.</p>
      </div>
    );
  }

  const entry = review.entry;

  const coverUrl = getAlbumCoverUrl(
    entry?.musicbrainz_id
  );

  const isOwner = review.is_owner;

  return (
    <div className="review-page">
      <button className="go-back-button" onClick={handleGoBack}>
        &lt; Go back
      </button>

      <div className="review-album-header">
        {coverUrl && (
          <img
            className="review-cover-large"
            src={coverUrl}
            alt={`${entry?.title} album cover`}
          />
        )}

        <div>
          <h1>{entry?.title}</h1>

          <h3>
            {entry?.artist}
            {entry?.year && ` · ${entry.year}`}
          </h3>

          <p>
            Reviewed by{" "}
            <Link to={`/user/${review.user?.username}`}>
              <strong>
                {review.user?.username}
              </strong>
            </Link>
          </p>
        </div>

      </div>
      <article className="full-review">
        <div className="review-header">
          <div>
            <h2>{review.title}</h2>

            <span>
              {new Date(
                review.created_at
              ).toLocaleDateString()}
            </span>
          </div>
          <RatingRing rating={review.rating} size={72} strokeWidth={6} />
        </div>

        <p className="review-body">
          {review.body}
        </p>

        {isOwner && (
          <div className="review-actions">

            <button
              className="edit-button"
              onClick={() =>
                navigate(
                  `/reviews/${review.id}/edit`
                )
              }
            >
              Edit
            </button>

            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>

          </div>
        )}
      </article>
      <CommentList reviewId={review.id} />
    </div>
  );
}