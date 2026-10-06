import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><div className="auth-card"><div className="brand">Watch<span>Party</span></div><h1>Welcome back</h1><p>Join your watch rooms.</p>
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/>
      {error && <p className="auth-error">{error}</p>}
      <button className="primary-btn full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
    <p>New here? <Link to="/signup">Create account</Link></p></div></main>;
}
