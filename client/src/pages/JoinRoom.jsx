import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const nav = useNavigate();
  const [params] = useSearchParams();
  const urlCode = params.get("code");

  function join(value = code) {
    const clean = value.trim().toUpperCase();
    if (!clean) return alert("Please enter a meeting code");
    nav(`/waiting/${clean}`);
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <span className="eyebrow">JOIN WATCH PARTY</span>
        <h1>Join a meeting</h1>
        <p>
          Enter the meeting code shared by your host, or open the invitation
          link directly.
        </p>
        <input
          className="code-input"
          value={urlCode || code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="WP7K29X"
          maxLength="10"
        />
        <button
          className="primary-btn full"
          onClick={() => join(urlCode || code)}
        >
          Join Meeting →
        </button>
        <div className="join-divider">
          <span>OR</span>
        </div>
        <p className="input-help">
          Your host can share the meeting through WhatsApp, Facebook, LinkedIn
          or any other app.
        </p>
      </div>
    </main>
  );
}
