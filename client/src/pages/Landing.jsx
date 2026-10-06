import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Addon from "./Addon";

export default function Landing() {
  return (
    <>
      <Navbar />
      <main className="landing page landing-modern">
        <section className="hero hero-modern">
          <span className="eyebrow">REAL-TIME YOUTUBE WATCH PARTY</span>
          <h1>
            Watch together.
            <br />
            <span>Connect together.</span>
          </h1>
          <p>
            Create a live watch party, share one simple link or meeting code,
            and watch YouTube videos together with synchronized playback, chat
            and video calling.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn big" to="/login">
              🎬 Host a Watch Party
            </Link>
            <Link className="secondary-btn big" to="/join">
              🔗 Join a Watch Party
            </Link>
          </div>
          <div className="hero-trust">
            <span>⚡ Real-time sync</span>
            <span>💬 Live chat</span>
            <span>📹 Video call</span>
            <span>🔗 Share anywhere</span>
          </div>
        </section>

        <section className="landing-preview">
          <div className="preview-window">
            <div className="preview-top">
              <span className="live-dot">● LIVE</span>
              <span>Friday Movie Night</span>
              <span className="preview-code">CODE: WP7K29X</span>
            </div>
            <div className="preview-video">
              <div className="play-circle">▶</div>
              <div className="preview-video-label">
                <img className="abcthmb" src="thmb.png" alt="" />
              </div>
            </div>
            <div className="preview-bottom">
              <span>👥 12 participants</span>
              <span>✓ Everyone synced</span>
              <span>🎙️ Call ready</span>
            </div>
          </div>
        </section>
      </main>
      <section className="bg-amber-50 max-h-[500px] w-full">
        <div className="flex items-center justify-center gap-10 max-w-7xl mx-auto px-6">
          <div className="text-black mb-20 mt-20 w-40%">
            <h1 className="text-black font-bold text-2xl">
              Meet on any device
            </h1>
            <p>
              Join on your mobile phone or tablet via the Google Meet app,
              available on the App Store and Play Store. Or connect from your
              computer browser – no software installation needed.
            </p>
            <div className="hero-actions">
              {" "}
              <Link className="secondary-btn big" to="/join">
                🔗 Join a Watch Party
              </Link>
            </div>
          </div>
          <div className="mt-20 mb-20">
            <img src="/first.webp" alt="img " />
          </div>
        </div>
      </section>
      <section className="bg-amber-50 max-h-[500px]  w-full">
        <div className="flex  items-center justify-center gap-10 max-w-7xl mx-auto px-6">
          <div className="mt-20 mb-30">
            <img src="/second.webp" alt="img " />
          </div>
          <div className="text-black  w-40%">
            <h1 className="text-black font-bold text-2xl">
              Meet on any device
            </h1>
            <p>
              Join on your mobile phone or tablet via the Google Meet app,
              available on the App Store and Play Store. Or connect from your
              computer browser – no software installation needed.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn big" to="/login">
                🎬 Host a Watch Party
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-amber-50 max-h-[500px] w-full">
        <div className="flex items-center justify-center gap-10  max-w-7xl mx-auto px-6">
          <div className="text-black mt-20 mb-30 w-40%">
            <h1 className="text-black font-bold text-2xl">
              Conference room devices from trusted partners
            </h1>
            <p>
              Google Meet hardware provides secure, scalable meeting solutions
              for any room. Cross-platform interoperability enables internal and
              external teams to easily join the discussion, while built-in AI
              ensures that everyone feels included and stays engaged.
            </p>
          </div>
          <div className="mt-20 mb-30">
            <img src="/third.webp" alt="img " />
          </div>
        </div>
      </section>
      <section className="bg-white w-full py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest text-blue-600">
              WATCH PARTY HELP
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Frequently asked questions
            </h2>

            <p className="text-gray-600 mt-4">
              Everything you need to know about creating and joining a Watch
              Party.
            </p>
          </div>

          <div className="space-y-4">
            {/* Question 1 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                What is Watch Party?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                Watch Party allows multiple people to watch YouTube videos
                together in real time. Everyone in the room stays synchronized
                while watching the same video.
              </p>
            </details>

            {/* Question 2 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                How do I create a Watch Party?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                Click on "Host a Watch Party", log in to your account and create
                a new room. You will receive a unique meeting link and meeting
                code that you can share with other participants.
              </p>
            </details>

            {/* Question 3 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                How can I join a Watch Party?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                You can join using the meeting link shared by the host or enter
                the Watch Party code on the Join page.
              </p>
            </details>

            {/* Question 4 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                Can everyone control the YouTube video?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                The host has full control over the video. Moderators can also
                control playback if the host assigns them the moderator role.
                Participants can watch the synchronized video.
              </p>
            </details>

            {/* Question 5 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                Can I talk to other participants?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                Yes. Watch Party supports live chat and video calling so
                participants can communicate while watching together.
              </p>
            </details>

            {/* Question 6 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                Do I need to install any software?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                No. You can join a Watch Party directly through a supported web
                browser using the shared meeting link or code.
              </p>
            </details>

            {/* Question 7 */}
            <details className="border-b border-gray-300 py-5">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900">
                Can I share my Watch Party with others?
                <span>+</span>
              </summary>

              <p className="text-gray-600 mt-4 leading-7">
                Yes. You can share the meeting link or meeting code with your
                friends, classmates or team members.
              </p>
            </details>
          </div>
        </div>
      </section>
      <Addon />
    </>
  );
}
