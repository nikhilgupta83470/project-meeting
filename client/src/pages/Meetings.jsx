import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRoomCode } from "../utils/helpers";

export default function Meetings() {
  const navigate = useNavigate();

  const [meetingName, setMeetingName] = useState("");
  const [meetingCode, setMeetingCode] = useState("");

  function createMeeting() {
    const code = makeRoomCode();
    const name = meetingName.trim() || "My Meeting";

    navigate(`/meeting/${code}?name=${encodeURIComponent(name)}`);
  }

  function joinMeeting() {
    const code = meetingCode.trim().toUpperCase();

    if (!code) {
      alert("Please enter a meeting code.");
      return;
    }

    navigate(`/meeting/${code}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Meetings</h1>

          <p className="mt-3 text-gray-600">
            Start or join a video meeting without watching a video.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* CREATE MEETING */}
          <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-2xl">
              📹
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              New Meeting
            </h2>

            <p className="mb-6 mt-2 text-gray-600">
              Create a meeting and invite other participants.
            </p>

            <input
              type="text"
              placeholder="Meeting name"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="mb-4 w-full rounded-lg border text-black border-black px-4 py-3 outline-none focus:border-red-500"
            />

            <button
              onClick={createMeeting}
              className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-black transition hover:bg-red-700"
            >
              Start New Meeting
            </button>
          </section>

          {/* JOIN MEETING */}
          <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              🔗
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Join Meeting
            </h2>

            <p className="mb-6 mt-2 text-gray-600">
              Enter the meeting code shared by the host.
            </p>

            <input
              type="text"
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  joinMeeting();
                }
              }}
              className="mb-4 w-full rounded-lg border text-black border-gray-300 px-4 py-3 uppercase tracking-widest outline-none focus:border-red-500"
            />

            <button
              onClick={joinMeeting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-100"
            >
              Join Meeting
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
