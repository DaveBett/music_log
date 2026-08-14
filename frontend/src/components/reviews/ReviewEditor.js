import { useEffect, useState } from "react";

export default function ReviewEditor({
  entry,
  review = null,
  onSave,
  onCancel
}) {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (review) {
      setTitle(review.title || "");
      setRating(review.rating ?? "");
      setBody(review.body || "");
    } else {
      setTitle("");
      setRating("");
      setBody("");
    }
  }, [review]);

  async function handleSubmit(event) {
    event.preventDefault();

    await onSave({
      title,
      rating,
      body
    });
  }

  return (
    <form
      className="review-editor"
      onSubmit={handleSubmit}
    >
      <h2>
        {review ? "Edit Review" : "Write a Review"}
      </h2>

      <label className="review-label">
        Review Title

        <input
          id="review-title"
          className="auth-input"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
        />
      </label>

      <label className="review-label">
        Rating

        <select
          className="auth-input"
          value={rating}
          onChange={(event) =>
            setRating(event.target.value)
          }
        >
          <option value="">
            No rating
          </option>

          {Array.from(
            { length: 10 },
            (_, index) => (
              <option
                key={index + 1}
                value={index + 1}
              >
                {index + 1}
              </option>
            )
          )}
        </select>
      </label>

      <label className="review-label">
        Review

        <textarea
          className="auth-input review-textarea"
          value={body}
          onChange={(event) =>
            setBody(event.target.value)
          }
          rows={8}
          required
        />
      </label>

      <div className="review-editor-actions">
        <button
          className="auth-button"
          type="submit"
        >
          {review
            ? "Save Changes"
            : "Publish Review"}
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}