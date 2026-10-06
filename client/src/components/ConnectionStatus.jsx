import React from "react";
export default function ConnectionStatus({ connected }) {
  return (
    <span className={`connection ${connected ? "online" : "offline"}`}>
      ● {connected ? "Connected" : "Reconnecting..."}
    </span>
  );
}
