import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useRoom } from "../context/RoomContext";
import MeetingCall from "../components/MeetingCall";

export default function MeetingRoom() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { socket, connected } = useRoom();

  const [participants, setParticipants] = useState([]);

  const meetingName = searchParams.get("name") || "Meeting";

  // =====================================================
  // JOIN STANDALONE MEETING
  // =====================================================

  useEffect(() => {
    if (!socket || !code || !user) return;

    if (!socket.connected) {
      socket.connect();
    }

    function joinMeeting() {
      socket.emit("meeting:join", {
        meetingCode: code,
        user: {
          id: user.id,
          name: user.name,
        },
      });
    }

    if (socket.connected) {
      joinMeeting();
    } else {
      socket.once("connect", joinMeeting);
    }

    return () => {
      socket.off("connect", joinMeeting);

      socket.emit("meeting:leave");
    };
  }, [socket, code, user]);

  // =====================================================
  // PARTICIPANTS
  // =====================================================

  useEffect(() => {
    if (!socket) return;

    function handleParticipants(list) {
      setParticipants(list || []);
    }

    socket.on("meeting:participants", handleParticipants);

    return () => {
      socket.off("meeting:participants", handleParticipants);
    };
  }, [socket]);

  // =====================================================
  // LEAVE MEETING
  // =====================================================

  const leaveMeeting = useCallback(() => {
    socket.emit("meeting:leave");

    navigate("/meetings");
  }, [socket, navigate]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* ================= HEADER ================= */}

      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-4 md:px-6">
        <div>
          <h1 className="text-lg font-semibold md:text-xl">{meetingName}</h1>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <span>Code:</span>

            <span className="font-medium tracking-wider text-white">
              {code}
            </span>
          </div>
        </div>

        {/* Connection status */}

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <span className="text-gray-400">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <button
            onClick={leaveMeeting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </header>

      {/* ================= MEETING AREA ================= */}

      <section className="mx-auto max-w-7xl">
        {/* Participants count */}

        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <p className="text-sm text-gray-400">
            {participants.length}{" "}
            {participants.length === 1 ? "participant" : "participants"}
          </p>

          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);

                alert("Meeting link copied!");
              } catch {
                alert("Could not copy meeting link.");
              }
            }}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
          >
            🔗 Copy Link
          </button>
        </div>

        {/* ================= VIDEO CALL ================= */}

        <div className="px-2 pb-4 md:px-4">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <MeetingCall
              socket={socket}
              participants={participants}
              currentUser={user}
              meetingCode={code}
              onLeave={leaveMeeting}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
