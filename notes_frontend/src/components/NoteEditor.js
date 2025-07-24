import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotesContext } from "../contexts/NotesContext";

// PUBLIC_INTERFACE
function NoteEditor() {
  /** Form to create or edit a note */
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    notes,
    tags,
    createNote,
    updateNote,
    fetchNotes
  } = useContext(NotesContext);
  const editing = Boolean(id);
  const existingNote = id ? notes.find((n) => String(n.id) === id) : null;

  const [title, setTitle] = useState(existingNote ? existingNote.title : "");
  const [content, setContent] = useState(existingNote ? existingNote.content : "");
  const [selectedTags, setSelectedTags] = useState(existingNote ? existingNote.tags || [] : []);
  const [error, setError] = useState("");

  // Sync editor fields when the note loads
  useEffect(() => {
    if (existingNote && editing) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setSelectedTags(existingNote.tags || []);
    }
    // eslint-disable-next-line
  }, [existingNote, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    const body = { title, content, tags: selectedTags };
    try {
      if (editing) {
        await updateNote(existingNote.id, body);
      } else {
        await createNote(body);
      }
      fetchNotes();
      navigate("/");
    } catch {
      setError("Failed to save note. Try again.");
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="note-editor-container">
      <h2>{editing ? "Edit Note" : "New Note"}</h2>
      <form className="note-editor-form" onSubmit={handleSubmit}>
        <input
          className="note-input-title"
          placeholder="Title"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-input-content"
          rows={10}
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="note-editor-tags">
          {tags.map((tag) => (
            <label key={tag.id} className="tag-checkbox">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />
              {tag.name}
            </label>
          ))}
        </div>
        <button className="btn btn-primary" type="submit">
          {editing ? "Save Changes" : "Create Note"}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}

export default NoteEditor;
