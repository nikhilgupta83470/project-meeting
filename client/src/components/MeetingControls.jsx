import React from "react";

export default function MeetingControls({
  isHost,
  playing,
  onPlay,
  onPause,
  onSeek,
  onChangeVideo,
  onRaiseHand,
  onReaction,
  onLeave,
}) {
  return (
    <div className="meeting-controls">
      <button className="control-btn" onClick={onRaiseHand}>
        ✋ Raise hand
      </button>

      <button className="control-btn" onClick={() => onReaction("❤️")}>
        ❤️
      </button>

      <button className="control-btn" onClick={() => onReaction("👏")}>
        👏
      </button>

      <button className="control-btn" onClick={() => onReaction("😂")}>
        😂
      </button>

      {isHost && (
        <>
          {/* Play / Pause */}
          <button className="control-btn" onClick={playing ? onPause : onPlay}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>

          {/* Seek */}
          <button
            className="control-btn"
            onClick={() => {
              const value = prompt("Enter time in seconds:");

              if (value === null) return;

              const time = Number(value);

              if (!Number.isFinite(time) || time < 0) {
                alert("Please enter a valid time.");
                return;
              }

              onSeek(time);
            }}
          >
            ↔ Seek
          </button>

          {/* Change Video */}
          <button className="control-btn" onClick={onChangeVideo}>
            Change video
          </button>
        </>
      )}

      {/* Leave Room */}
      <button className="danger-btn" onClick={onLeave}>
        Leave
      </button>
    </div>
  );
}
