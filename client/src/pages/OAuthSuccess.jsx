import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function OAuthSuccess() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    async function finishLogin() {
      const token = params.get("token");

      if (!token) {
        nav("/login?error=Authentication%20failed", {
          replace: true,
        });
        return;
      }

      try {
        localStorage.setItem("watch_token", token);

        const data = await apiRequest("/auth/me");

        localStorage.setItem("watch_user", JSON.stringify(data.user));

        nav("/dashboard", { replace: true });
      } catch (error) {
        localStorage.removeItem("watch_token");
        localStorage.removeItem("watch_user");

        nav("/login?error=Authentication%20failed", {
          replace: true,
        });
      }
    }

    finishLogin();
  }, [nav, params]);

  return (
    <main className="min-h-screen bg-[#080b10] flex items-center justify-center">
      <div className="rounded-2xl border border-[#292f39] bg-[#11151d] p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-red-500" />

        <h1 className="text-xl font-bold text-white">Signing you in...</h1>

        <p className="mt-2 text-gray-400">Please wait.</p>
      </div>
    </main>
  );
}
