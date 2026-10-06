import { useState } from "react";
export default function RoomSettings() {
  const [privateRoom, setPrivateRoom] = useState(true);
  return (
    <main className="page">
      <div className="form-card wide">
        <span className="eyebrow">ROOM SETTINGS</span>
        <h1>Manage your room</h1>
        <label>
          Room name
          <input defaultValue="Movie Night" />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={privateRoom}
            onChange={(e) => setPrivateRoom(e.target.checked)}
          />{" "}
          Private room
        </label>
        <label className="check">
          <input type="checkbox" defaultChecked /> Only host controls playback
        </label>
        <label className="check">
          <input type="checkbox" defaultChecked /> Allow chat
        </label>
        <button className="primary-btn">Save settings</button>
      </div>
    </main>
  );
}
