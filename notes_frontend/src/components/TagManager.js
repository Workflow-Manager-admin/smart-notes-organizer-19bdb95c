import React, { useContext, useState } from "react";
import { NotesContext } from "../contexts/NotesContext";

// PUBLIC_INTERFACE
function TagManager() {
  /** UI for creating and deleting tags */
  const { tags, createTag, deleteTag } = useContext(NotesContext);
  const [tagName, setTagName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!tagName.trim()) {
      setError("Tag name required.");
      return;
    }
    try {
      await createTag(tagName.trim());
      setTagName("");
    } catch {
      setError("Could not create tag.");
    }
  };

  return (
    <div className="tag-manager-container">
      <h2>Tag Management</h2>
      <form className="tag-create-form" onSubmit={handleCreate}>
        <input
          placeholder="New tag name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Tag
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <ul className="tag-list">
        {tags.map((tag) => (
          <li key={tag.id} className="tag-list-item">
            <span>{tag.name}</span>
            <button className="btn btn-danger" onClick={() => deleteTag(tag.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagManager;
