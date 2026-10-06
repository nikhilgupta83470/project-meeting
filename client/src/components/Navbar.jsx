import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        Watch<span>Party</span>
      </Link>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <a href="/history">History</a>
        <Link to="/meetings">📹 Meetings</Link>
        <a href="/profile">Profile</a>
        {user ? (
          <button className="ghost-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
