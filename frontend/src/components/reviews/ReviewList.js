import ReviewCard from "./ReviewCard";

export default function ReviewList({
  reviews,
  editable = false,
  onEdit,
  onDelete
}) {
  if (reviews.length === 0) {
    return (
      <div className="empty-reviews">
        <p>No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="review-list">

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          editable={editable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}