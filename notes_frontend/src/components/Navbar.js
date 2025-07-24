import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

// PUBLIC_INTERFACE
function Navbar({ onLogout }) {
  /** Top navigation bar with user info and logout */
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <span className="navbar-title" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        📝 Smart Notes Organizer
      </span>
      <span className="navbar-right">
        <span className="user-info">{user?.email}</span>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </span>
    </nav>
  );
}

export default Navbar;
