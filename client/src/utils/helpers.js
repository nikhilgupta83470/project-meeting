export function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function getYouTubeId(value = "") {
  const input = value.trim();

  if (!input) return "";

  // Direct YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase();

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      const id = url.pathname.split("/")[1];

      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    // youtube.com/watch?v=VIDEO_ID
    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const watchId = url.searchParams.get("v");

      if (/^[a-zA-Z0-9_-]{11}$/.test(watchId || "")) {
        return watchId;
      }

      // /shorts/VIDEO_ID
      const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);

      if (shortsMatch) {
        return shortsMatch[1];
      }

      // /embed/VIDEO_ID
      const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);

      if (embedMatch) {
        return embedMatch[1];
      }
    }
  } catch {
    return "";
  }

  return "";
}
