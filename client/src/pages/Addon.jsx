import React from "react";

const Addon = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Top Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-200">
            {/* Social */}
            <div className="flex text-black items-center gap-6">
              <span className="text-red-700 font-medium">Follow our blog</span>

              <span className="h-6 w-px bg-gray-400"></span>

              <div className="w-12 h-12 rounded-full bg-[#62605f] border-2  flex items-center justify-center">
                {" "}
                <a href="#" className="text-black hover:text-black text-xl">
                  𝕏
                </a>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#62605f] border-2  flex items-center justify-center">
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-600 text-xl"
                >
                  ▶
                </a>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#62605f] border-2  flex items-center justify-center">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-700 text-xl"
                >
                  in
                </a>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#62605f] border-2  flex items-center justify-center">
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 text-xl"
                >
                  ◎
                </a>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#62605f] border-2  flex items-center justify-center">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-xl"
                >
                  f
                </a>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center bg-gray-100 px-4 py-3 w-full md:w-96">
              <span className="text-gray-500 text-xl mr-3">🔍</span>

              <input
                type="text"
                placeholder="Search this site"
                className="bg-transparent outline-none w-full text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pt-10">
            {/* Column 1 */}
            <div>
              <h3 className="text-gray-800 font-medium text-lg mb-5">
                Watch Party
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Create Watch Party
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Join Watch Party
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Watch Together
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Video Call
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-gray-800 font-medium text-lg mb-5">
                Features
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    YouTube Sync
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Real-time Playback
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Screen Sharing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Video Calling
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Room Management
                  </a>
                </li>
              </ul>

              <h3 className="text-gray-800 font-medium text-lg mt-8 mb-5">
                Roles
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>Host</li>
                <li>Moderator</li>
                <li>Participant</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-gray-800 font-medium text-lg mb-5">
                Resources
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-gray-800 font-medium text-lg mb-5">
                Security & Management
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Room Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    User Authentication
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Host Controls
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Moderator Controls
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5 */}
            <div>
              <h3 className="text-gray-800 font-medium text-lg mb-5">
                Learning & Support
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Setup Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Troubleshooting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    What's New
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Report an Issue
                  </a>
                </li>
              </ul>

              <h3 className="text-gray-800 font-medium text-lg mt-8 mb-5">
                More
              </h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About Watch Party
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Our Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 Watch Party. All rights reserved.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600">
                Privacy
              </a>

              <a href="#" className="hover:text-blue-600">
                Terms
              </a>

              <a href="#" className="hover:text-blue-600">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Addon;
