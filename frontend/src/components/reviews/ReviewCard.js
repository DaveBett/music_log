import { useNavigate } from "react-router-dom";
import { getAlbumCoverUrl } from "../../api/endpoints";
import RatingRing from "./RatingRing";

export default function ReviewCard({
  review,
  editable = false,
  onEdit,
  onDelete,
  backTo
}) {
  const navigate = useNavigate();
  const entry = review.entry;

  const coverUrl = getAlbumCoverUrl(
    entry?.musicbrainz_id
  );

  function handleGoToReview() {
    navigate(`/reviews/${review.id}`, {
      state: { from: backTo }
    });
  }

  return (
    <article className="review-card">
      <div className="review-card-main">
        <div className="review-header">
          {coverUrl && (
            <img className="review-cover-large" src={coverUrl} alt={`${entry?.title} album cover`}/>
          )}
          <div className="review-info">
            <h2>
              {entry?.artist} -{" "}{entry?.title}
            </h2>

            {entry?.year && (
              <p>
                {entry.year}
              </p>
            )}
          </div>
          <RatingRing rating={review.rating} size={52} />
        </div>

        <h3>{review.title}</h3>
        <p className="review-body review-body-truncated">
          {review.body}
        </p>

        <div className="review-card-content">
          <div className="review-footer">
            <span>
              {new Date(
                review.created_at
              ).toLocaleDateString()}
            </span>
            
            <div className="go-to-review">
              <button
                className="go-to-review-button"
                onClick={handleGoToReview}
              >
                Go to Review &gt;
              </button>
            </div>

            {editable && (
              <div className="review-actions">
                <button
                  className="edit-button"
                  onClick={() => onEdit(review)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => onDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}