import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await signup(name,email,password); nav("/dashboard"); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><div className="auth-card"><div className="brand">Watch<span>Party</span></div><h1>Create account</h1><p>Start your first room.</p>
    <form onSubmit={handleSubmit}>
      <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required autoComplete="name"/>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
      <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete="new-password"/>
      {error && <p className="auth-error">{error}</p>}
      <button className="primary-btn full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
    </form>
    <p>Already have an account? <Link to="/login">Login</Link></p></div></main>;
}
