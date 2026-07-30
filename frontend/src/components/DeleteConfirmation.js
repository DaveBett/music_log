const DeleteConfirmation = ({
  entry,
  onCancel,
  onDelete
}) => {

  return (
      <div className="entry delete-confirmation">

          <h3>
              Delete this album?
          </h3>

          <p>
              <strong>{entry.artist}</strong>
          </p>

          <p>
              {entry.title} ({entry.year})
          </p>

          <p>
              This action cannot be undone.
          </p>

          <div className="buttons">

              <button onClick={onCancel}>
                  Cancel
              </button>

              <button onClick={onDelete}>
                  Delete
              </button>

          </div>

      </div>
  );
}

export default DeleteConfirmation;