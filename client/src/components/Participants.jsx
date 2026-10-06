import RoleBadge from "./RoleBadge";
import React from "react";
export default function Participants({ participants, currentUser, onAction }) {
  return (
    <section className="panel">
      <div className="panel-title"><h3>Participants</h3><span>{participants.length}</span></div>
      <div className="participant-list">
        {participants.map(p => (
          <div className="participant" key={p.id}>
            <div className="avatar">{p.name?.slice(0,1).toUpperCase()}</div>
            <div className="participant-info">
              <strong>{p.name}{p.id === currentUser?.id ? " (You)" : ""}</strong>
              <RoleBadge role={p.role} />
            </div>
            {currentUser?.role === "Host" && p.id !== currentUser.id && (
              <button className="icon-btn" onClick={() => onAction?.(p)}>⋯</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
