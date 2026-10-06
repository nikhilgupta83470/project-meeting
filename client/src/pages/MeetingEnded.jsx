import { Link } from "react-router-dom";
export default function MeetingEnded() {
  return (
    <main className="center-page">
      <div className="form-card">
        <div className="big-icon">✓</div>
        <h1>Meeting ended</h1>
        <p>Your watch party has ended. Thanks for watching together.</p>
        <Link className="primary-btn full" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
