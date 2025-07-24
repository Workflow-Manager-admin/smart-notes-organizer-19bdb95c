import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/Register";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import NoteView from "./components/NoteView";
import TagManager from "./components/TagManager";

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  /** Wrapper for routes requiring authentication */
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// PUBLIC_INTERFACE
function AppLayout() {
  /** Main layout for authenticated users: sidebar, topbar, main */
  const { logout } = useContext(AuthContext);
  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-content">
        <Navbar onLogout={logout} />
        <div className="main-scroll">
          <Routes>
            <Route path="/" element={<NotesList />} />
            <Route path="/notes/:id" element={<NoteView />} />
            <Route path="/edit/:id" element={<NoteEditor />} />
            <Route path="/new" element={<NoteEditor />} />
            <Route path="/tags" element={<TagManager />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level app with authentication and state providers
   */
  useEffect(() => {
    // Default theme
    document.documentElement.setAttribute("data-theme", "light");
  }, []);
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <div className="centered-auth">
                  <Login />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="centered-auth">
                  <Register />
                </div>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
