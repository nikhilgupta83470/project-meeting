import React, { useEffect, useRef, useState } from "react";

const rtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

export default function MeetingCall({
  socket,
  participants,
  currentUser,
  meetingCode,
  onLeave,
}) {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map());

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  function addRemoteStream(socketId, stream, name) {
    setRemoteStreams((prev) => {
      const existing = prev.find((item) => item.socketId === socketId);

      if (existing) {
        return prev.map((item) =>
          item.socketId === socketId ? { ...item, stream, name } : item,
        );
      }

      return [
        ...prev,
        {
          socketId,
          stream,
          name: name || "Participant",
        },
      ];
    });
  }

  function removePeer(socketId) {
    const pc = peersRef.current.get(socketId);

    if (pc) {
      pc.close();
      peersRef.current.delete(socketId);
    }

    setRemoteStreams((prev) =>
      prev.filter((item) => item.socketId !== socketId),
    );
  }

  async function createPeer(remote) {
    if (!remote?.socketId) return null;

    if (peersRef.current.has(remote.socketId)) {
      return peersRef.current.get(remote.socketId);
    }

    const pc = new RTCPeerConnection(rtcConfig);

    peersRef.current.set(remote.socketId, pc);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      socket.emit("meeting:ice-candidate", {
        targetSocketId: remote.socketId,
        candidate: event.candidate,
      });
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];

      if (stream) {
        addRemoteStream(remote.socketId, stream, remote.name);
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "closed" ||
        pc.connectionState === "disconnected"
      ) {
        removePeer(remote.socketId);
      }
    };

    return pc;
  }

  async function callPeer(remote) {
    if (!remote?.socketId) return;

    const pc = await createPeer(remote);

    if (!pc) return;

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    socket.emit("meeting:offer", {
      targetSocketId: remote.socketId,

      offer,

      from: {
        socketId: socket.id,
        name: currentUser?.name || "Participant",
      },
    });
  }

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("meeting:ready");
      } catch (error) {
        console.error("Camera/microphone error:", error);

        alert("Camera and microphone permission is required for the meeting.");
      }
    }

    startCamera();

    async function handlePeerReady(remote) {
      if (!remote?.socketId) return;

      // Only one side creates the offer.
      if (socket.id < remote.socketId) {
        await callPeer(remote);
      }
    }

    async function handleOffer({ from, offer }) {
      if (!from?.socketId || !offer) return;

      const pc =
        (await createPeer(from)) || peersRef.current.get(from.socketId);

      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      socket.emit("meeting:answer", {
        targetSocketId: from.socketId,
        answer,
      });
    }

    async function handleAnswer({ fromSocketId, answer }) {
      const pc = peersRef.current.get(fromSocketId);

      if (!pc || !answer) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async function handleIceCandidate({ fromSocketId, candidate }) {
      const pc = peersRef.current.get(fromSocketId);

      if (!pc || !candidate) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    }

    function handlePeerLeft({ socketId }) {
      removePeer(socketId);
    }

    socket.on("meeting:peer-ready", handlePeerReady);

    socket.on("meeting:offer", handleOffer);

    socket.on("meeting:answer", handleAnswer);

    socket.on("meeting:ice-candidate", handleIceCandidate);

    socket.on("meeting:peer-left", handlePeerLeft);

    return () => {
      mounted = false;

      socket.off("meeting:peer-ready", handlePeerReady);

      socket.off("meeting:offer", handleOffer);

      socket.off("meeting:answer", handleAnswer);

      socket.off("meeting:ice-candidate", handleIceCandidate);

      socket.off("meeting:peer-left", handlePeerLeft);

      peersRef.current.forEach((pc) => {
        pc.close();
      });

      peersRef.current.clear();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, [socket]);

  function toggleMic() {
    if (!localStreamRef.current) return;

    const audioTracks = localStreamRef.current.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn((prev) => !prev);
  }

  function toggleCamera() {
    if (!localStreamRef.current) return;

    const videoTracks = localStreamRef.current.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOn((prev) => !prev);
  }async function inviteParticipants() {
    const meetingLink = `${window.location.origin}/meeting/${meetingCode}`;

    const shareText = `Join my meeting 👋

Meeting Code: ${meetingCode}

Meeting Link:
${meetingLink}`;

    // Mobile / supported browser
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my meeting",
          text: shareText,
          url: meetingLink,
        });
      } catch (error) {
        // User closed share popup
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }

      return;
    }

    // Fallback for desktop browsers
    try {
      await navigator.clipboard.writeText(shareText);

      alert(
        `Meeting details copied!\n\nMeeting Code: ${meetingCode}\n\nMeeting Link:\n${meetingLink}`,
      );
    } catch (error) {
      alert(shareText);
    }
  }

  return (
    <div className="bg-gray-950 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Local Video */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-sm">
            {currentUser?.name || "You"}
          </div>
        </div>

        {/* Remote Videos */}
        {remoteStreams.map((item) => (
          <RemoteVideo
            key={item.socketId}
            stream={item.stream}
            name={item.name}
          />
        ))}
      </div>

      {remoteStreams.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400">
          Waiting for other participants...
        </div>
      )}

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={inviteParticipants}
          className="rounded-full bg-gray-800 px-5 py-3 text-sm transition hover:bg-gray-700"
        >
          🔗 Invite
        </button>

        <button
          onClick={toggleMic}
          className="rounded-full bg-gray-800 px-5 py-3 text-sm transition hover:bg-gray-700"
        >
          {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
        </button>

        <button
          onClick={toggleCamera}
          className="rounded-full bg-gray-800 px-5 py-3 text-sm transition hover:bg-gray-700"
        >
          {cameraOn ? "📹 Camera On" : "📷 Camera Off"}
        </button>

        <button
          onClick={onLeave}
          className="rounded-full bg-red-600 px-5 py-3 text-sm font-medium transition hover:bg-red-700"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

function RemoteVideo({ stream, name }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-sm">
        {name}
      </div>
    </div>
  );
}
