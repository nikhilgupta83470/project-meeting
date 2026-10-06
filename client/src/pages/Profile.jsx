import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Guest");
  const [email, setEmail] = useState(user?.email || "guest@example.com");
  const [saving, setSaving] = useState(false);

  // Keep profile data synced with logged-in user
  useEffect(() => {
    if (user) {
      setName(user.name || "Guest");
      setEmail(user.email || "guest@example.com");
    }
  }, [user]);

  const initial = name?.charAt(0)?.toUpperCase() || "G";

  const saveProfile = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("watch_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user information stored in browser
      localStorage.setItem("watch_user", JSON.stringify(data.user));

      // Update displayed name immediately
      setName(data.user.name);

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#6d6b6b] py-12 px-4 text-black">
        <div className="max-w-3xl mx-auto">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black">My Profile</h1>

            <p className="text-gray-600 mt-1">
              View and manage your account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-[#aba9a7] border border-gray-300 rounded-lg shadow-sm">
            {/* Card Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-black">
                Profile Information
              </h2>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Avatar */}
                <div className="h-24 w-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold border-4 border-red-600">
                  {initial}
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-black">{name}</h2>

                  <p className="text-gray-600 mt-1">{email}</p>

                  <span className="inline-block mt-3 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded">
                    ● Active Account
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-7"></div>

              {/* Details */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>

                  <div className="border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
                    {name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>

                  <div className="border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
                    {email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Account Type
                  </label>

                  <div className="border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
                    Watch Party User
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-black text-white px-5 py-2.5 rounded-md font-semibold hover:bg-gray-800 transition"
                >
                  Edit Profile
                </button>

                <button className="border border-red-300 text-red-600 px-5 py-2.5 rounded-md font-semibold hover:bg-red-50 transition">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm mt-6">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-black">
                Account Settings
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-black">
                    Email Notifications
                  </h3>

                  <p className="text-sm text-gray-500">
                    Receive notifications about your Watch Parties.
                  </p>
                </div>

                <span className="text-green-600 font-semibold text-sm">
                  Enabled
                </span>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-black">Live Chat</h3>

                  <p className="text-sm text-gray-500">
                    Chat with people during Watch Parties.
                  </p>
                </div>

                <span className="text-green-600 font-semibold text-sm">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Edit Profile</h2>

                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-black"
                  />
                </div>

                {/* Email - currently read only */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-100 text-gray-500 outline-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setEditing(false)}
                    disabled={saving}
                    className="border border-gray-300 px-5 py-2.5 rounded-md font-semibold text-black hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="bg-black text-white px-5 py-2.5 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
