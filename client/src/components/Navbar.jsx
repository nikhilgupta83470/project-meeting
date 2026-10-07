
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);

      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{
        width: "100%",
        minHeight: "70px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "800",
        }}
      >
        Watch<span className="text-red-500">Party</span>
      </Link>

      {isMobile ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "28px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      ) : (
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Link to="/dashboard">Dashboard</Link>

          <Link to="/history">History</Link>

          <Link to="/meetings">📹 Meetings</Link>

          <Link to="/profile">Profile</Link>

          {user ? (
            <button onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      )}

      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            width: "100%",
            padding: "16px 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            background: "#0b0d12",
            zIndex: 9999,
          }}
        >
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <Link to="/history" onClick={() => setMenuOpen(false)}>
            History
          </Link>

          <Link to="/meetings" onClick={() => setMenuOpen(false)}>
            📹 Meetings
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>

          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
