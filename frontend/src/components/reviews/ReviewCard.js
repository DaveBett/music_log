import { Link } from "react-router-dom";
import { getAlbumCoverUrl } from "../../api/endpoints";

export default function ReviewCard({
  review,
  editable = false,
  onEdit,
  onDelete
}) {
  const entry = review.entry;

  const coverUrl = getAlbumCoverUrl(
    entry?.musicbrainz_id
  );

  return (
    <article className="review-card">
      <div className="review-card-main">
        <Link to={`/reviews/${review.id}`} className="review-card-link" >
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
            <div className="review-rating">
              {review.rating ??
                "-"}
            </div>
          </div>
          <h3>{review.title}</h3>
          <p className="review-body">
            {review.body}
          </p>
        </Link>

        <div className="review-card-content">
          <div className="review-footer">
            <span>
              {new Date(
                review.created_at
              ).toLocaleDateString()}
            </span>

            {editable && (
              <div className="review-actions">

                <button
                  className="edit-button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    onEdit(review);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    onDelete(review.id);
                  }}
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