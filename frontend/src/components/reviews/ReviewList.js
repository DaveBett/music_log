import ReviewCard from "./ReviewCard";

export default function ReviewList({
  reviews,
  editable = false,
  onEdit,
  onDelete,
  backTo
}) {
  if (reviews.length === 0) {
    return (
      <div className="empty-reviews">
        <p>No reviews match your search.</p>
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
          backTo={backTo}
        />
      ))}

    </div>
  );
}