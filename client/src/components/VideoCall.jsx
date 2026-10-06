import React, { useEffect, useRef, useState } from "react";

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export default function VideoCall({ socket, participants, currentUser, onEndCall, onEndForEveryone, inviteUrl }) {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map());
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenTrackRef = useRef(null);

  function upsertRemote(socketId, stream, name) {
    setRemoteStreams((prev) => {
      const existing = prev.find((item) => item.socketId === socketId);
      if (existing) {
        return prev.map((item) => item.socketId === socketId ? { ...item, stream, name } : item);
      }
      return [...prev, { socketId, stream, name }];
    });
  }

  function removePeer(socketId) {
    const peer = peersRef.current.get(socketId);
    peer?.close();
    peersRef.current.delete(socketId);
    setRemoteStreams((prev) => prev.filter((item) => item.socketId !== socketId));
  }

  async function createPeer(remote) {
    if (!remote?.socketId || remote.socketId === socket.id || peersRef.current.has(remote.socketId)) return null;

    const pc = new RTCPeerConnection(rtcConfig);
    peersRef.current.set(remote.socketId, pc);

    localStreamRef.current?.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          targetSocketId: remote.socketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) upsertRemote(remote.socketId, stream, remote.name);
    };

    pc.onconnectionstatechange = () => {
      if (["failed", "closed", "disconnected"].includes(pc.connectionState)) {
        removePeer(remote.socketId);
      }
    };

    return pc;
  }

  async function callPeer(remote) {
    const pc = await createPeer(remote);
    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("call:offer", {
      targetSocketId: remote.socketId,
      offer,
      from: { socketId: socket.id, name: currentUser?.name || "Guest" },
    });
  }

  useEffect(() => {
    let mounted = true;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit("call:ready");
      } catch (error) {
        alert("Camera/microphone permission is required to start the video call.");
        onEndCall?.();
      }
    }

    startMedia();

    const onPeerReady = async (remote) => {
      // Deterministic initiator avoids offer/answer glare.
      if (socket.id < remote.socketId) await callPeer(remote);
    };

    const onOffer = async ({ from, offer }) => {
      const pc = (await createPeer(from)) || peersRef.current.get(from.socketId);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("call:answer", { targetSocketId: from.socketId, answer });
    };

    const onAnswer = async ({ fromSocketId, answer }) => {
      const pc = peersRef.current.get(fromSocketId);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const onIceCandidate = async ({ fromSocketId, candidate }) => {
      const pc = peersRef.current.get(fromSocketId);
      if (!pc || !candidate) return;
      try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch { /* peer may already be closed */ }
    };

    const onPeerLeft = ({ socketId }) => removePeer(socketId);

    socket.on("call:peer-ready", onPeerReady);
    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:ice-candidate", onIceCandidate);
    socket.on("call:peer-left", onPeerLeft);

    return () => {
      mounted = false;
      socket.off("call:peer-ready", onPeerReady);
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:ice-candidate", onIceCandidate);
      socket.off("call:peer-left", onPeerLeft);
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setRemoteStreams([]);
    };
  }, [socket, onEndCall, currentUser?.name]);

  function toggleMic() {
    const next = !micOn;
    localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = next; });
    setMicOn(next);
  }

  function toggleCamera() {
    const next = !cameraOn;
    localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = next; });
    setCameraOn(next);
  }

  async function toggleScreenShare() {
    if (screenSharing) {
      const cameraTrack = localStreamRef.current?.getVideoTracks().find((track) => track.kind === "video" && track !== screenTrackRef.current);
      if (cameraTrack) {
        for (const pc of peersRef.current.values()) {
          const sender = pc.getSenders().find((item) => item.track?.kind === "video");
          if (sender) await sender.replaceTrack(cameraTrack);
        }
      }
      screenTrackRef.current?.stop();
      screenTrackRef.current = null;
      setScreenSharing(false);
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      alert("Screen sharing is not supported in this browser.");
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;
      for (const pc of peersRef.current.values()) {
        const sender = pc.getSenders().find((item) => item.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = displayStream;
      setScreenSharing(true);
      screenTrack.onended = () => toggleScreenShare();
    } catch {
      // User cancelled the browser picker.
    }
  }

  async function copyInvite() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Join my Watch Party call", text: "Join my video call", url: inviteUrl });
      } else {
        await navigator.clipboard.writeText(inviteUrl);
        alert("Invite link copied!");
      }
    } catch { /* share cancelled */ }
  }

  return (
    <div className="call-overlay">
      <div className="call-header">
        <div><strong>Video Call</strong><span>{remoteStreams.length + 1} in call</span></div>
        <button className="icon-btn" onClick={copyInvite}>🔗 Invite</button>
      </div>
      <div className={`call-grid ${remoteStreams.length === 0 ? "single" : ""}`}>
        <div className="call-tile local">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <span>{currentUser?.name || "You"} (You)</span>
        </div>
        {remoteStreams.map((item) => (
          <div className="call-tile" key={item.socketId}>
            <video ref={(node) => { if (node && node.srcObject !== item.stream) node.srcObject = item.stream; }} autoPlay playsInline />
            <span>{item.name || "Participant"}</span>
          </div>
        ))}
      </div>
      <div className="call-controls">
        <button className={`control-btn ${!micOn ? "active-off" : ""}`} onClick={toggleMic}>{micOn ? "🎙️ Mute" : "🔇 Unmute"}</button>
        <button className={`control-btn ${!cameraOn ? "active-off" : ""}`} onClick={toggleCamera}>{cameraOn ? "📷 Camera" : "🚫 Camera"}</button>
        <button className="control-btn" onClick={toggleScreenShare}>{screenSharing ? "🛑 Stop sharing" : "🖥️ Share screen"}</button>
        <button className="danger-btn" onClick={onEndCall}>📞 Leave call</button>
        {onEndForEveryone && <button className="danger-btn" onClick={onEndForEveryone}>⛔ End for everyone</button>}
      </div>
    </div>
  );
}
