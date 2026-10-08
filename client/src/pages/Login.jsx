import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function googleLogin() {
    window.location.href = `${API_URL}/auth/google`;
  }

  function githubLogin() {
    window.location.href = `${API_URL}/auth/github`;
  }

  return (
    <main className="min-h-screen bg-[#080b10] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#292f39] bg-[#11151d] p-8 shadow-2xl">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-white">
            Watch<span className="text-red-500">Party</span>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">Welcome back</h1>

          <p className="mt-2 text-gray-400">
            Login to continue to your watch rooms.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={googleLogin}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={githubLogin}
            className="w-full rounded-xl bg-[#24292f] px-4 py-3 font-semibold text-white transition hover:bg-[#30363d]"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#292f39]" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-[#292f39]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-[#2a303a] bg-[#0a0d12] px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-red-400 hover:text-red-300"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#2a303a] bg-[#0a0d12] px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          New here?{" "}
          <Link
            to="/signup"
            className="font-semibold text-red-400 hover:text-red-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
