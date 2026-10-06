import { useState } from "react";
import React from "react";
export default function Chat({ messages, onSend }) {
  const [text, setText] = useState("");

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <section className="panel chat">
      <div className="panel-title"><h3>Room Chat</h3><span>Live</span></div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div className="message" key={m.id || i}>
            <strong>{m.name}</strong>
            <p>{m.text}</p>
            <small>{m.time || ""}</small>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." />
        <button className="primary-btn">Send</button>
      </form>
    </section>
  );
}
