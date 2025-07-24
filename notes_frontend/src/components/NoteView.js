import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotesContext } from "../contexts/NotesContext";

// PUBLIC_INTERFACE
function NoteView() {
  /** Details view for a note, with edit/delete */
  const { notes, tags, deleteNote } = useContext(NotesContext);
  const { id } = useParams();
  const note = notes.find((n) => String(n.id) === id);
  const navigate = useNavigate();

  if (!note) return <div>Note not found.</div>;

  const confirmDelete = async () => {
    if (window.confirm("Delete this note?")) {
      await deleteNote(note.id);
      navigate("/");
    }
  };

  return (
    <div className="note-view-container">
      <div className="note-view-top">
        <h2>{note.title}</h2>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate(`/edit/${note.id}`)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </div>
      <div className="note-view-meta">
        <span>
          Last updated:{" "}
          {new Date(note.updated_at || note.created_at).toLocaleString()}
        </span>
      </div>
      <div className="note-view-content">{note.content}</div>
      <div className="note-view-tags">
        Tags:{" "}
        {note.tags && note.tags.length > 0
          ? note.tags
              .map((tid) => tags.find((t) => t.id === tid)?.name)
              .filter(Boolean)
              .join(", ")
          : "—"}
      </div>
    </div>
  );
}

export default NoteView;
