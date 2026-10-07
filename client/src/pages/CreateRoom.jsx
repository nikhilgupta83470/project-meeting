import React, { useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";
import { makeRoomCode, getYouTubeId } from "../utils/helpers";

function ShareButtons({ link, text }) {
  const [copied, setCopied] = useState(false);

  const encodedLink = encodeURIComponent(link);
  const encodedText = encodeURIComponent(text);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy link");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Watch Party Invitation",
          text,
          url: link,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copy();
    }
  };

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        Share your meeting
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button
          onClick={copy}
          className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>

        <button
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodedText}%20${encodedLink}`,
              "_blank",
            )
          }
          className="rounded-xl bg-green-500 px-3 py-3 text-sm font-semibold text-white hover:bg-green-600 transition"
        >
          WhatsApp
        </button>

        <button
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
              "_blank",
            )
          }
          className="rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Facebook
        </button>

        <button
          onClick={() =>
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
              "_blank",
            )
          }
          className="rounded-xl bg-sky-700 px-3 py-3 text-sm font-semibold text-white hover:bg-sky-800 transition"
        >
          LinkedIn
        </button>

        <button
          onClick={share}
          className="rounded-xl bg-gray-900 px-3 py-3 text-sm font-semibold text-white hover:bg-black transition"
        >
          ↗ Share
        </button>
      </div>
    </div>
  );
}

function SettingToggle({ icon, title, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />

        <div
          className={`w-11 h-6 rounded-full transition ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`h-5 w-5 bg-white rounded-full shadow transform transition translate-y-0.5 ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
      </div>
    </label>
  );
}

export default function CreateRoom() {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("Movie Night");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");

  const [participantLimit, setParticipantLimit] = useState("20");

  const [enableChat, setEnableChat] = useState(true);
  const [enableVideoCall, setEnableVideoCall] = useState(true);

  const [created, setCreated] = useState(null);

  const videoId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);

  const videoThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  async function createRoom() {
    if (!roomName.trim()) {
      return alert("Please enter a meeting name");
    }

    if (!videoId || videoId.length !== 11) {
      return alert(
        "Please enter a valid YouTube URL or 11-character YouTube video code",
      );
    }

    const code = makeRoomCode();

    try {
      const token = localStorage.getItem("watch_token");

      if (!token) {
        return alert("Please login first");
      }

      // Production + Local API
      const data = await apiRequest("/rooms", {
        method: "POST",
        body: JSON.stringify({
          roomCode: code,
          name: roomName.trim(),
          videoId: videoId,
        }),
      });

      if (!data?.room) {
        return alert(data?.message || "Failed to create room");
      }

      // Save newly created room
      const setup = {
        code: data.room.roomCode,
        name: data.room.name,
        video: data.room.videoId,
      };

      localStorage.setItem("room_setup", JSON.stringify(setup));

      // Show created screen
      setCreated(setup);
    } catch (error) {
      console.error("Create room error:", error);

      alert(
        error.message ||
          "Server error. Please make sure the backend server is running.",
      );
    }
  }

  /* =========================
     CREATED SCREEN
  ========================= */

  if (created) {
    const link = `${window.location.origin}/room/${created.code}`;

    const text = `You're invited to ${created.name}. Join the Watch Party using this meeting link:`;

    return (
      <main className="min-h-screen bg-gradient-to-br text-black from-slate-50 via-white to-blue-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
              ✓
            </div>

            <p className="text-sm font-bold tracking-widest text-blue-600">
              MEETING CREATED
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
              Your Watch Party is ready!
            </h1>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Share the meeting link or code with your friends and start
              watching together.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Meeting Code */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    MEETING CODE
                  </p>

                  <h2 className="text-4xl font-bold tracking-[0.2em] mt-2">
                    {created.code}
                  </h2>
                </div>

                <button
                  onClick={() => navigator.clipboard?.writeText(created.code)}
                  className="rounded-xl bg-white text-blue-700 px-5 py-3 font-semibold hover:bg-blue-50 transition"
                >
                  📋 Copy Code
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Meeting Link */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Meeting link
                </label>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    value={link}
                    readOnly
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
                  />

                  <button
                    onClick={() => navigator.clipboard?.writeText(link)}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-white font-semibold hover:bg-black transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Share */}
              <ShareButtons link={link} text={text} />

              {/* Video Preview */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">
                    🎬 Selected YouTube Video
                  </h3>

                  <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">
                    YouTube
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  {videoThumbnail && (
                    <img
                      src={videoThumbnail}
                      alt="YouTube video thumbnail"
                      className="w-full max-h-72 object-cover"
                    />
                  )}

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500">VIDEO CODE</p>

                      <p className="font-mono font-bold text-gray-900 mt-1">
                        {created.video}
                      </p>
                    </div>

                    <button
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                      onClick={() =>
                        navigator.clipboard?.writeText(created.video)
                      }
                    >
                      Copy Video ID
                    </button>
                  </div>
                </div>
              </div>

              {/* Meeting Settings */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-3">
                  ⚙️ Meeting settings
                </h3>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">PARTICIPANT LIMIT</p>

                    <p className="text-lg font-bold text-gray-900 mt-1">
                      👥 {participantLimit} people
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">FEATURES</p>

                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      {enableChat && "💬 Chat "}
                      {enableVideoCall && "📹 Video Call"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    MEETING DESCRIPTION
                  </p>

                  <p className="text-sm text-gray-700 mt-2">{description}</p>
                </div>
              )}

              {/* Start */}
              <div className="mt-8">
                <button
                  className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-white font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  onClick={() => {
                    // Make absolutely sure the NEW meeting
                    // is the one opened in WatchRoom.
                    localStorage.setItem(
                      "room_setup",
                      JSON.stringify({
                        code: created.code,
                        name: created.name,
                        video: created.video,
                      }),
                    );

                    navigate(`/room/${created.code}`);
                  }}
                >
                  🚀 Start Watch Party
                </button>

                <button
                  className="w-full mt-3 rounded-xl px-5 py-3 text-gray-600 font-medium hover:bg-gray-100 transition"
                  onClick={() => setCreated(null)}
                >
                  ← Edit Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     CREATE SCREEN
  ========================= */

  return (
    <main className="min-h-screen bg-[#676666] text-black from-slate-50 via-white to-blue-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            🎬 WATCH PARTY
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            HOST
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">
            Create your Watch Party
          </h1>

          <p className="text-black mt-4 max-w-2xl mx-auto">
            Create a room, add a YouTube video and invite your friends. Everyone
            can watch together in real time.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* LEFT */}
          <div className="bg-[#fdfbfb] rounded-3xl border border-black shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">
                🏠
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Meeting details
                </h2>

                <p className="text-sm text-gray-500">Set up your Watch Party</p>
              </div>
            </div>

            {/* Meeting Name */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meeting name
              </label>

              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Friday Movie Night"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meeting description
                <span className="font-normal text-gray-400 ml-2">Optional</span>
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Friday movie night with college friends..."
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>

            {/* YouTube */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                YouTube video
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  ▶️
                </span>

                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Paste a YouTube URL or directly enter its 11-character video ID.
              </p>
            </div>

            {/* Thumbnail Preview */}
            {videoThumbnail && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={videoThumbnail}
                  alt="YouTube preview"
                  className="w-full h-52 object-cover"
                />

                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    ✓ YouTube video detected
                  </span>

                  <span className="font-mono text-xs text-gray-500">
                    {videoId}
                  </span>
                </div>
              </div>
            )}

            {/* Participant Limit */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum participants
              </label>

              <select
                value={participantLimit}
                onChange={(e) => setParticipantLimit(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="5">5 participants</option>
                <option value="10">10 participants</option>
                <option value="20">20 participants</option>
                <option value="50">50 participants</option>
                <option value="100">100 participants</option>
                <option value="200">200 participants</option>
              </select>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <SettingToggle
                icon="💬"
                title="Live Chat"
                description="Allow participants to chat"
                checked={enableChat}
                onChange={(e) => setEnableChat(e.target.checked)}
              />

              <SettingToggle
                icon="📹"
                title="Video Call"
                description="Allow participants to join the call"
                checked={enableVideoCall}
                onChange={(e) => setEnableVideoCall(e.target.checked)}
              />
            </div>

            {/* Create Button */}
            <button
              onClick={createRoom}
              className="w-full mt-7 rounded-2xl bg-blue-600 px-6 py-4 text-white font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Create Meeting & Get Invite Link
              <span className="ml-2">→</span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* Preview */}
            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs text-gray-400">LIVE PREVIEW</p>

                  <h3 className="font-bold mt-1">
                    {roomName || "Your Watch Party"}
                  </h3>
                </div>

                <span className="rounded-full bg-red-500/20 text-red-300 px-3 py-1 text-xs font-semibold">
                  ● LIVE
                </span>
              </div>

              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                {videoThumbnail ? (
                  <div className="relative w-full h-full">
                    <img
                      src={videoThumbnail}
                      alt="Video preview"
                      className="w-full h-full object-cover opacity-80"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center text-gray-900 text-2xl shadow-lg">
                        ▶
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 px-6">
                    <div className="text-5xl mb-3">🎬</div>

                    <p className="font-medium">
                      Your video preview will appear here
                    </p>

                    <p className="text-xs mt-2">Add a YouTube video above</p>
                  </div>
                )}
              </div>

              <div className="p-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-300">
                <div>
                  <div className="text-lg">👥</div>
                  {participantLimit} max
                </div>

                <div>
                  <div className="text-lg">{enableChat ? "💬" : "🚫"}</div>
                  Chat
                </div>

                <div>
                  <div className="text-lg">{enableVideoCall ? "📹" : "🚫"}</div>
                  Call
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
              <h3 className="font-bold text-gray-900 text-lg">How it works</h3>

              <div className="mt-5 space-y-5">
                <div className="flex gap-4">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    1
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Create your room
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Add a name and YouTube video.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    2
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Share the invite
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Send the meeting link or code.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    3
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Watch together
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Everyone watches the synchronized video.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6">
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>

                <div>
                  <h3 className="font-bold text-blue-900">Host tip</h3>

                  <p className="text-sm text-blue-800/80 mt-1 leading-6">
                    Share the meeting code with your friends if you don't want
                    to send the full invitation link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
