import React, { useContext, useEffect } from "react";
import { NotesContext } from "../contexts/NotesContext";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
function NotesList() {
  /** Main list of notes with search and filters */
  const {
    notes,
    tags,
    loading,
    search,
    setSearch,
    selectedTags,
    fetchNotes
  } = useContext(NotesContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
    // only fetchNotes should be a dependency
    // eslint-disable-next-line
  }, [search, selectedTags]);

  return (
    <div className="notes-list-container">
      <div className="notes-list-top">
        <input
          className="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => navigate("/new")}>
          + New Note
        </button>
      </div>
      {loading && <div>Loading notes...</div>}
      <div className="notes-list">
        {notes.length === 0 && !loading && <div>No notes found.</div>}
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-list-item"
            onClick={() => navigate(`/notes/${note.id}`)}
          >
            <div className="note-title">{note.title}</div>
            <div className="note-snippet">
              {note.content.slice(0, 80)}{note.content.length > 80 && "..."}
            </div>
            <div className="note-tags">
              {note.tags && note.tags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <span className="note-tag-mini" key={tag.id}>
                    {tag.name}
                  </span>
                ) : null;
              })}
            </div>
            <div className="note-meta">
              <span>
                {new Date(note.updated_at || note.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesList;
