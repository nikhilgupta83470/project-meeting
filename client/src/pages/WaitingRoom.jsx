import { Link, useParams } from "react-router-dom";
import React from "react";
export default function WaitingRoom() {
  const { code } = useParams();
  return (
    <main className="waiting page">
      <span className="eyebrow">ROOM READY</span>
      <h1>You're in the waiting room</h1>
      <p>
        Room code: <strong>{code}</strong>
      </p>
      <div className="waiting-card">
        <div className="spinner"></div>
        <h2>Waiting for the host</h2>
        <p>The meeting will begin when the host starts playback.</p>
        <Link className="primary-btn" to={`/room/${code}`}>
          Enter demo meeting
        </Link>
      </div>
    </main>
  );
}
