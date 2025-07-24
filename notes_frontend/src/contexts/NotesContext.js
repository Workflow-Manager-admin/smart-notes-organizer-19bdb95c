import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const NotesContext = createContext();

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /**
   * Holds and manages notes, tags, selected note, search, filters, and note CRUD.
   */
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch notes and tags on login or changes
  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchTags();
    }
    // eslint-disable-next-line
  }, [token]);

  // PUBLIC_INTERFACE
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    let url = `${API_URL}/notes`;
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (selectedTags.length > 0) params.push(`tags=${selectedTags.join(",")}`);
    if (params.length > 0) url += `?${params.join("&")}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    }
    setLoading(false);
  }, [token, search, selectedTags]);

  // PUBLIC_INTERFACE
  const fetchTags = useCallback(async () => {
    const res = await fetch(`${API_URL}/tags`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setTags(await res.json());
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const createNote = async (note) => {
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error("Could not create note");
    await fetchNotes();
  };

  // PUBLIC_INTERFACE
  const updateNote = async (id, note) => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error("Could not update note");
    await fetchNotes();
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Could not delete note");
    await fetchNotes();
  };

  // PUBLIC_INTERFACE
  const createTag = async (name) => {
    const res = await fetch(`${API_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      await fetchTags();
    }
  };

  // PUBLIC_INTERFACE
  const deleteTag = async (tagId) => {
    const res = await fetch(`${API_URL}/tags/${tagId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      await fetchTags();
      await fetchNotes();
    }
  };

  const contextValue = {
    notes,
    tags,
    loading,
    search,
    setSearch,
    selectedTags,
    setSelectedTags,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    createTag,
    deleteTag
  };

  return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
}
