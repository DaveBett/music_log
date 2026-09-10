import { useState } from "react";
import { MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import EntryActionMenu from "./EntryActionMenu";

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
  isNew,
  editable = false,
}) => {
  const isMobile = useIsMobile(700);
  const [menuOpen, setMenuOpen] = useState(false);

  const classes = [
    "entry",
    editing && "editing",
    isNew && "new-entry",
    isMobile && editable && "entry-clickable"
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

  function handleCardClick() {
    if (isMobile && editable) {
      setMenuOpen(true);
    }
  }

  if (confirmDelete) {
    return (
      <div className="entry delete-confirm">
        <div className="delete-entry">
          <div className="delete-name">
            <strong>{artist}</strong><br/>
            {title}
          </div>

          <div className="delete-message">
            Delete this album?
          </div>
            <button  className="confirm-delete" onClick={handleConfirmDelete}>
              Delete
            </button>
            <button className="cancel-delete" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes} onClick={handleCardClick}>
      <div className="entry-container">
        <h3 className="entry-number">{index}</h3>
        <h3 className="entry-date">{added}</h3>
        <h3 className="entry-artist">{artist}</h3>

        {editable && !isMobile ? (
            <h3 className="entry-album">
              <Link to={`/reviews/new/${id}`} onClick={(e) => e.stopPropagation()}>{title}</Link>
            </h3>
          ) : (
            <h3 className="entry-album">{title}</h3>
          )
        }

        <h3 className="entry-year">({year})</h3>

        {editable && !isMobile && (
          <div className="entry-actions">
            <MdOutlineModeEdit
              size="25px"
              onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            />
            <MdOutlineDeleteForever
              size="25px"
              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(id); }}
            />
          </div>
        )}
      </div>

      {menuOpen && (
        <EntryActionMenu
          entry={entry}
          onEdit={handleEdit}
          onDelete={() => setConfirmDeleteId(id)}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default Entry