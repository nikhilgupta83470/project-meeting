import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

export default function RoomHistory() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const token = localStorage.getItem("watch_token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Use API helper instead of localhost
      const data = await apiRequest("/rooms");

      // Backend may return an array directly
      // or { rooms: [...] }
      const roomList = Array.isArray(data)
        ? data
        : Array.isArray(data?.rooms)
          ? data.rooms
          : [];

      setRooms(roomList);
    } catch (error) {
      console.error("History error:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  function openRoom(room) {
    localStorage.setItem(
      "room_setup",
      JSON.stringify({
        code: room.roomCode,
        name: room.name,
        video: room.videoId || "",
      }),
    );

    window.location.href = `/room/${room.roomCode}`;
  }

  function getThumbnail(videoId) {
    if (!videoId) {
      return "https://via.placeholder.com/640x360?text=No+Video";
    }

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  return (
    <>
      <Navbar />

      <main className="page history-page">
        {/* HEADER */}
        <div className="history-heading">
          <span className="eyebrow">HISTORY</span>

          <h1>Room History</h1>

          <p>
            View and manage your previous Watch Party rooms. Open any room to
            continue your shared viewing experience.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="history-status">
            <h3>Loading...</h3>
            <p>Fetching your Watch Party rooms.</p>
          </div>
        )}

        {/* NO ROOMS */}
        {!loading && rooms.length === 0 && (
          <div className="history-status">
            <h3>No rooms yet</h3>
            <p>Create a Watch Party room and it will appear here.</p>
          </div>
        )}

        {/* ROOM GRID */}
        {!loading && rooms.length > 0 && (
          <div className="history-grid">
            {rooms.map((room) => (
              <div className="history-card" key={room._id}>
                {/* THUMBNAIL */}
                <div className="history-thumbnail">
                  <img
                    src={getThumbnail(room.videoId)}
                    alt={room.name}
                    onError={(e) => {
                      if (room.videoId) {
                        e.currentTarget.src = `https://img.youtube.com/vi/${room.videoId}/hqdefault.jpg`;
                      }
                    }}
                  />
                </div>

                {/* DETAILS */}
                <div className="history-card-body">
                  <span className="history-type">WATCH PARTY</span>

                  <h2 title={room.name}>{room.name}</h2>

                  <div className="history-meta">
                    <div>
                      <span>Room Code</span>
                      <strong>{room.roomCode}</strong>
                    </div>

                    <div>
                      <span>Video ID</span>
                      <strong>{room.videoId || "No video"}</strong>
                    </div>

                    <div>
                      <span>Members</span>
                      <strong>{room.participants?.length || 0}</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong
                        className={
                          room.isActive ? "status-active" : "status-ended"
                        }
                      >
                        {room.isActive ? "Active" : "Ended"}
                      </strong>
                    </div>
                  </div>

                  <div className="history-date">
                    Created{" "}
                    {new Date(room.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* OPEN ROOM BUTTON */}
                  <button
                    className="open-room-btn"
                    type="button"
                    onClick={() => openRoom(room)}
                  >
                    Open Room →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
