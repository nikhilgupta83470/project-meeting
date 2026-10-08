import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b10] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#292f39] bg-[#11151d] p-8 shadow-2xl">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-white">
            Watch<span className="text-red-500">Party</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify Your Email"}
            {step === 3 && "Password Updated"}
          </h1>

          <p className="mt-2 text-gray-400">
            {step === 1 &&
              "Enter your email and we'll send you a verification code."}

            {step === 2 && "Enter the 6-digit code sent to your Gmail."}

            {step === 3 && "Your password has been successfully changed."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={sendCode} className="mt-7 space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#2a303a] bg-[#0a0d12] px-4 py-3 text-white outline-none focus:border-red-500"
            />

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="mt-7 space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit verification code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              className="w-full rounded-xl border border-[#2a303a] bg-[#0a0d12] px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none focus:border-red-500"
            />

            <input
              type="password"
              placeholder="New password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#2a303a] bg-[#0a0d12] px-4 py-3 text-white outline-none focus:border-red-500"
            />

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                {message}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="mt-7">
            {message && (
              <div className="rounded-xl bg-green-500/10 p-4 text-center text-green-400">
                {message}
              </div>
            )}

            <button
              onClick={() => nav("/login")}
              className="mt-5 w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-red-400 hover:text-red-300"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
