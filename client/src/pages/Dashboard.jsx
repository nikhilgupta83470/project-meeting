import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#62605f] from-slate-50 via-white to-blue-50 text-black">
        {/* ================= HERO ================= */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="bg-white rounded-3xl border border-[#6d6c6c] shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
              {/* LEFT */}
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-semibold text-brown-700">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  WATCH PARTY DASHBOARD
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mt-6 leading-tight">
                  Welcome back,
                  <br />
                  <span className="text-red-600"> Make Your Call.</span>
                </h1>

                <p className="text-gray-600 text-lg mt-5 max-w-2xl leading-8">
                  Host a synchronized YouTube meeting, invite your friends with
                  a simple link or code, and connect through video call.
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link
                    to="/create"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition shadow-lg shadow-blue-200"
                  >
                    🎬 Host a Watch Party
                  </Link>

                  <Link
                    to="/join"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-black font-semibold hover:bg-gray-50 hover:-translate-y-0.5 transition"
                  >
                    🔗 Join with Code
                  </Link>
                </div>
              </div>

              {/* RIGHT VISUAL */}
              <div className="bg-gradient-to-br from-brown to-black min-h-[300px] flex items-center justify-center p-8">
                <div className="relative w-full max-w-sm">
                  {/* Main card */}
                  <div className="bg-white rounded-3xl shadow-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          LIVE WATCH PARTY
                        </p>

                        <h3 className="font-bold text-gray-900 mt-1">
                          Friday Movie Night
                        </h3>
                      </div>

                      <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                        ● LIVE
                      </span>
                    </div>

                    {/* Video */}
                    <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">
                        ▶
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-gray-600">👥 12 participants</span>

                      <span className="text-green-600 font-semibold">
                        ✓ Synced
                      </span>
                    </div>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -right-5 -bottom-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        👥
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Participants</p>

                        <p className="font-bold text-gray-900">
                          Everyone synced
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUICK JOIN ================= */}
        <section className="max-w-7xl mx-auto px-6 py-5">
          <div className="rounded-3xl bg-[#2f2d2c] text-black p-7 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
                  <span>⚡</span>
                  JOIN QUICKLY
                </div>

                <h2 className="text-2xl md:text-3xl text-white font-bold mt-2">
                  Have a meeting code?
                </h2>

                <p className="text-gray-400 mt-2">
                  Enter the code shared by your host and join the Watch Party.
                </p>
              </div>

              <Link
                to="/join"
                className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3.5 font-bold hover:bg-gray-100 transition whitespace-nowrap"
              >
                Enter Meeting Code →
              </Link>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                🎬
              </div>

              <p className="text-gray-500 text-sm mt-4">Watch Parties</p>

              <h3 className="text-2xl font-bold text-black mt-1">Ready</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                👥
              </div>

              <p className="text-gray-500 text-sm mt-4">Participants</p>

              <h3 className="text-2xl font-bold text-black mt-1">Online</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                💬
              </div>

              <p className="text-gray-500 text-sm mt-4">Live Chat</p>

              <h3 className="text-2xl font-bold text-black mt-1">Enabled</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                📹
              </div>

              <p className="text-gray-500 text-sm mt-4">Video Call</p>

              <h3 className="text-2xl font-bold text-black mt-1">Ready</h3>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-7">
            <span className="text-sm font-bold tracking-widest text-blue-600">
              YOUR WORKSPACE
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">
              Everything you need to connect
            </h2>

            <p className="text-black mt-3">
              Start a Watch Party, join your friends or manage your account.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* HOST */}
            <Link
              to="/create"
              className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                🎬
              </div>

              <h2 className="text-xl font-bold text-black mt-5">
                Host a Watch Party
              </h2>

              <p className="text-gray-600 mt-3 leading-6">
                Create a meeting, add a YouTube video and get a shareable link
                and meeting code.
              </p>

              <span className="inline-block text-blue-600 font-semibold mt-5">
                Start hosting →
              </span>
            </Link>

            {/* JOIN */}
            <Link
              to="/join"
              className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                🔗
              </div>

              <h2 className="text-xl font-bold text-black mt-5">
                Join a Watch Party
              </h2>

              <p className="text-gray-600 mt-3 leading-6">
                Join instantly using a meeting code or invitation link shared by
                your host.
              </p>

              <span className="inline-block text-green-600 font-semibold mt-5">
                Join now →
              </span>
            </Link>

            {/* HISTORY */}
            <Link
              to="/history"
              className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ◷
              </div>

              <h2 className="text-xl font-bold text-black mt-5">
                Room History
              </h2>

              <p className="text-gray-600 mt-3 leading-6">
                See your previous Watch Party rooms and sessions.
              </p>

              <span className="inline-block text-purple-600 font-semibold mt-5">
                View history →
              </span>
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ◎
              </div>

              <h2 className="text-xl font-bold text-black mt-5">
                Your Profile
              </h2>

              <p className="text-gray-600 mt-3 leading-6">
                Manage your account, profile information and preferences.
              </p>

              <span className="inline-block text-orange-600 font-semibold mt-5">
                Manage profile →
              </span>
            </Link>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10">
            <div className="text-center mb-10">
              <span className="text-sm font-bold tracking-widest text-blue-600">
                HOW IT WORKS
              </span>

              <h2 className="text-3xl font-bold text-black mt-2">
                Start watching together in three steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-blue-600 text-black flex items-center justify-center text-xl font-bold">
                  1
                </div>

                <h3 className="font-bold text-xl mt-5 text-black">Create</h3>

                <p className="text-gray-600 mt-2">
                  Add your meeting name and YouTube video.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-blue-600 text-black flex items-center justify-center text-xl font-bold">
                  2
                </div>

                <h3 className="font-bold text-xl mt-5 text-black">Invite</h3>

                <p className="text-gray-600 mt-2">
                  Share your meeting link or code with friends.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>

                <h3 className="font-bold text-xl mt-5 text-black">Watch</h3>

                <p className="text-gray-600 mt-2">
                  Enjoy synchronized YouTube playback together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOST TIP ================= */}
        <section className="max-w-7xl mx-auto px-6 pt-5 pb-16">
          <div className="rounded-3xl bg-blue-50 border border-blue-100 p-7 md:p-8">
            <div className="flex flex-col md:flex-row gap-5 md:items-center">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                💡
              </div>

              <div>
                <h3 className="text-xl font-bold text-black">Host tip</h3>

                <p className="text-gray-600 mt-1 leading-7">
                  Create your room first, then share the meeting code with your
                  friends. Everyone can join from their own device and watch the
                  same YouTube video together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
