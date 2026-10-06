import React from "react";
export default function RoleBadge({ role }) {
  return <span className={`role ${role?.toLowerCase()}`}>{role}</span>;
}
