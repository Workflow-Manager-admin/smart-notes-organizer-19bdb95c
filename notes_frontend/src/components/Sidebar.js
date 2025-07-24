import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NotesContext } from "../contexts/NotesContext";
import "../App.css";

// PUBLIC_INTERFACE
function Sidebar() {
  /** Sidebar for navigation and filtering */
  const { tags, selectedTags, setSelectedTags } = useContext(NotesContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag.id)
        ? prev.filter((id) => id !== tag.id)
        : [...prev, tag.id]
    );
  };

  return (
    <div className="sidebar">
      <button
        className={`sidebar-btn${location.pathname === "/" ? " active" : ""}`}
        onClick={() => navigate("/")}
      >
        All Notes
      </button>
      <button
        className={`sidebar-btn${location.pathname === "/new" ? " active" : ""}`}
        onClick={() => navigate("/new")}
      >
        + New Note
      </button>
      <button
        className={`sidebar-btn${location.pathname === "/tags" ? " active" : ""}`}
        onClick={() => navigate("/tags")}
      >
        Manage Tags
      </button>
      <div className="sidebar-section">
        <div className="sidebar-label">Filter by Tag:</div>
        {tags.map((tag) => (
          <div
            className={`sidebar-tag${selectedTags.includes(tag.id) ? " selected" : ""}`}
            key={tag.id}
            onClick={() => onToggleTag(tag)}
          >
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
