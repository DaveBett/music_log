import { useNavigate } from "react-router-dom";

export default function EntryActionMenu({ entry, onEdit, onDelete, onClose }) {
  const navigate = useNavigate();

  function handleReview() {
    onClose();
    navigate(`/reviews/new/${entry.id}`);
  }

  function handleEdit() {
    onClose();
    onEdit();
  }

  function handleDelete() {
    onClose();
    onDelete();
  }

  return (
    <div className="entry-action-overlay" onClick={onClose}>
      <div className="entry-action-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="entry-action-sheet-header">
          <strong>{entry.artist}</strong>
          <span>{entry.title}</span>
        </div>

        <button className="entry-action-item" onClick={handleReview}>
          Write a Review
        </button>

        <button className="entry-action-item" onClick={handleEdit}>
          Edit Entry
        </button>

        <button className="entry-action-item entry-action-danger" onClick={handleDelete}>
          Delete Entry
        </button>

        <button className="entry-action-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}