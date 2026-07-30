import { MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md";

const Entry = ({ 
  id, 
  index, 
  added, 
  artist,
  title, 
  year,
  deleteEntry,
  entry, 
  onEdit, 
  editing,
  confirmDelete,
  setConfirmDeleteId,
  isNew
}) => {

  const classes = [
    "entry",
    editing && "editing",
    isNew && "new-entry"
  ]
    .filter(Boolean)
    .join(" ");

  const handleEdit = async () => {
    await onEdit(entry);
  }

  const handleConfirmDelete = async () => {
    await deleteEntry(id);
    setConfirmDeleteId(null);
  };

  if (confirmDelete) {
    return (
      <div className="entry delete-confirm">
        <div className="entry-container">
          <div className="bigger">
            <strong>{artist}</strong><br/>
            {title}
          </div>

          <div className="big delete-message">
            Delete this album?
          </div>

          <button 
            className="confirm-delete"
            onClick={handleConfirmDelete}
            >Delete
          </button>
          <button
            className="cancel-delete"
            onClick={() => setConfirmDeleteId(null)}
          >
            Cancel
          </button>
          </div>
        </div>
      );
    }

  return (
    <div className={classes}>
      <div className="entry-container">
        <h3 className="small">{index}</h3>
        <h3 className="medium">{added}</h3>
        <h3 className="big">{artist}</h3>
        <h3 className="big">{title}</h3>
        <h3 className="medium">({year})</h3>
        <MdOutlineModeEdit className="small" size="25px" onClick={handleEdit}/>
        <MdOutlineDeleteForever className="small" size="25px" onClick={() => setConfirmDeleteId(id)}/>
      </div>
    </div>
  )
}

export default Entry