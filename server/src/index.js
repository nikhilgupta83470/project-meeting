import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import Meeting from "./models/Meeting.js";

// Database
import connectDB from "./config/database.js";
import { Resend } from "resend";
// MongoDB Models
import User from "./models/User.js";
import Room from "./models/Room.js";
import Message from "./models/Message.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import nodemailer from "nodemailer";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const server = http.createServer(app);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD length:",
  process.env.EMAIL_APP_PASSWORD?.length,
);

// ======================================================
// CORS CONFIGURATION
// ======================================================
const allowedOrigins = [
  "https://project-meeting-omega.vercel.app",
  "https://project-meeting-fl7oxrcjo-nikhil-8034.vercel.app",
  "https://project-meeting-git-main-nikhil-8034.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {
  cors: {
    ...corsOptions,
    methods: ["GET", "POST"],
  },
});

// ======================================================
// CONNECT DATABASE
// ======================================================

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors(corsOptions));

app.use(express.json());

// ======================================================
// IN-MEMORY WATCH PARTY STATE
// ======================================================

const rooms = new Map();

// ======================================================
// IN-MEMORY STANDALONE MEETING STATE
// ======================================================

const meetingRooms = new Map();

function getMeeting(code) {
  if (!meetingRooms.has(code)) {
    meetingRooms.set(code, {
      code,
      participants: new Map(),
    });
  }

  return meetingRooms.get(code);
}

// ======================================================
// BASIC ROUTES
// ======================================================

app.get("/", (_, res) => {
  res.json({
    message: "Watch Party API running",
  });
});

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
  });
});

// ======================================================
// AUTHENTICATION
// ======================================================

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
// ======================================================
// EMAIL CONFIGURATION
// ======================================================

const resend = new Resend(process.env.RESEND_API_KEY);

// ======================================================
// GOOGLE LOGIN
// ======================================================

app.get("/api/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.SERVER_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
});

app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=Google%20login%20failed`,
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.SERVER_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("Google access token not received");
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new Error("Google email not received");
    }

    const email = profile.email.toLowerCase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.name || "Google User",
        email,
        avatar: profile.picture || "",
        googleId: profile.id,
      });
    } else {
      user.googleId = profile.id;
      user.avatar = profile.picture || user.avatar;
      await user.save();
    }

    const token = createToken(user._id.toString());

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    console.error("Google login error:", error);

    res.redirect(
      `${process.env.CLIENT_URL}/login?error=Google%20login%20failed`,
    );
  }
});

// ======================================================
// GITHUB LOGIN
// ======================================================

app.get("/api/auth/github", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.SERVER_URL}/api/auth/github/callback`,
    scope: "read:user user:email",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

app.get("/api/auth/github/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=GitHub%20login%20failed`,
      );
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("GitHub access token not received");
    }

    const githubResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    const githubUser = await githubResponse.json();

    let email = githubUser.email;

    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
        },
      });

      const emails = await emailsResponse.json();

      const primaryEmail = emails.find((item) => item.primary && item.verified);

      email = primaryEmail?.email;
    }

    if (!email) {
      throw new Error("GitHub email not available");
    }

    email = email.toLowerCase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: githubUser.name || githubUser.login || "GitHub User",
        email,
        avatar: githubUser.avatar_url || "",
        githubId: String(githubUser.id),
      });
    } else {
      user.githubId = String(githubUser.id);
      user.avatar = githubUser.avatar_url || user.avatar;
      await user.save();
    }

    const token = createToken(user._id.toString());

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    console.error("GitHub login error:", error);

    res.redirect(
      `${process.env.CLIENT_URL}/login?error=GitHub%20login%20failed`,
    );
  }
});

// ======================================================
// FORGOT PASSWORD - SEND VERIFICATION CODE
// ======================================================
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [normalizedEmail],
      subject: "WatchParty Password Reset Code",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
        ">

          <h2>WatchParty Password Reset</h2>

          <p>Your password reset verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
            background: #f4f4f4;
            text-align: center;
          ">
            ${code}
          </div>

          <p>
            This code will expire in <b>10 minutes</b>.
          </p>

          <p>
            If you did not request this code, you can safely ignore this email.
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return res.status(500).json({
        message: error.message || "Could not send verification code",
      });
    }

    console.log("PASSWORD RESET EMAIL SENT:", data?.id);

    res.json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message || "Could not send verification code",
    });
  }
});

// ======================================================
// RESET PASSWORD
// ======================================================

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, verification code and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetCode = null;
    user.resetCodeExpires = null;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Password reset failed",
    });
  }
});

// ======================================================
// SIGNUP
// ======================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ======================================================
// CURRENT USER
// ======================================================

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

// ======================================================
// UPDATE PROFILE
// ======================================================

app.put("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("_id name email avatar");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
});

// ======================================================
// GET WATCH PARTY ROOMS
// ======================================================

app.get("/api/rooms", requireAuth, async (req, res) => {
  try {
    const rooms = await Room.find({
      host: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);

    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
});
//  CREATE MEETING

app.post("/api/meetings", requireAuth, async (req, res) => {
  try {
    const { meetingCode, name } = req.body;

    if (!meetingCode) {
      return res.status(400).json({
        message: "Meeting code is required",
      });
    }

    const existingMeeting = await Meeting.findOne({
      meetingCode: meetingCode.toUpperCase(),
    });

    if (existingMeeting) {
      return res.status(409).json({
        message: "Meeting code already exists",
      });
    }

    const meeting = await Meeting.create({
      meetingCode: meetingCode.toUpperCase(),
      name: name?.trim() || "My Meeting",
      host: req.user._id,
      participants: [
        {
          user: req.user._id,
          name: req.user.name,
        },
      ],
      isActive: true,
    });

    res.status(201).json({
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);

    res.status(500).json({
      message: "Failed to create meeting",
      error: error.message,
    });
  }
});

// ======================================================
// CREATE WATCH PARTY ROOM
// ======================================================

app.post("/api/rooms", requireAuth, async (req, res) => {
  try {
    const { roomCode, name, videoId } = req.body;

    if (!roomCode || !name) {
      return res.status(400).json({
        message: "Room code and room name are required",
      });
    }

    const existingRoom = await Room.findOne({
      roomCode,
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "Room code already exists",
      });
    }

    const room = await Room.create({
      roomCode,
      name: name.trim(),
      host: req.user._id,
      videoId: videoId || "",
      isPlaying: false,
      currentTime: 0,

      participants: [
        {
          user: req.user._id,
          role: "Host",
        },
      ],

      isActive: true,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
});

// ======================================================
// WATCH PARTY ROOM HELPER
// ======================================================

function getRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, {
      code,
      name: "Watch Room",
      hostId: null,
      videoId: "",

      playback: {
        playing: false,
        currentTime: 0,
        videoId: "",
      },

      participants: new Map(),
      messages: [],
      callActive: false,
    });
  }

  return rooms.get(code);
}

// ======================================================
// SOCKET.IO AUTHENTICATION
// ======================================================

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id name email avatar",
    );

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.authUser = user;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);

    next(new Error("Invalid or expired token"));
  }
});

// ======================================================
// SOCKET.IO CONNECTION
// ======================================================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ====================================================
  // WATCH PARTY - JOIN
  // ====================================================

  socket.on("room:join", ({ roomCode, roomName, videoId }) => {
    if (!roomCode) return;

    const room = getRoom(roomCode);

    if (roomName && room.name === "Watch Room") {
      room.name = roomName;
    }

    if (videoId && !room.videoId) {
      room.videoId = videoId;
      room.playback.videoId = videoId;
    }

    const user = {
      id: socket.authUser._id.toString(),
      name: socket.authUser.name,
      email: socket.authUser.email,
      avatar: socket.authUser.avatar || "",
    };

    if (!room.hostId) {
      room.hostId = user.id;
      user.role = "Host";
    } else if (user.id === room.hostId) {
      user.role = "Host";
    } else {
      user.role = "Participant";
    }

    room.participants.set(socket.id, {
      ...user,
      socketId: socket.id,
    });

    socket.join(roomCode);

    socket.roomCode = roomCode;
    socket.user = room.participants.get(socket.id);

    io.to(roomCode).emit("room:state", {
      room: {
        code: room.code,
        name: room.name,
      },

      participants: [...room.participants.values()],

      playback: room.playback,

      messages: room.messages,

      callActive: room.callActive,
    });
  });

  // ====================================================
  // WATCH PARTY VIDEO CALL
  // ====================================================

  socket.on("call:start", () => {
    const room = rooms.get(socket.roomCode);

    if (!room) return;

    room.callActive = true;

    io.to(socket.roomCode).emit("call:started");
  });

  socket.on("call:stop", () => {
    const room = rooms.get(socket.roomCode);

    if (!room) return;

    room.callActive = false;

    io.to(socket.roomCode).emit("call:stopped");
  });

  socket.on("call:leave", () => {
    if (!socket.roomCode) return;

    socket.to(socket.roomCode).emit("call:peer-left", {
      socketId: socket.id,
    });
  });

  socket.on("call:ready", () => {
    const room = rooms.get(socket.roomCode);

    if (!room || !room.callActive) return;

    socket.to(socket.roomCode).emit("call:peer-ready", {
      socketId: socket.id,
      name: socket.user?.name || "Participant",
    });
  });

  socket.on("call:offer", ({ targetSocketId, offer, from }) => {
    if (!targetSocketId || !offer) return;

    io.to(targetSocketId).emit("call:offer", {
      offer,

      from: {
        socketId: socket.id,
        name: from?.name || socket.user?.name || "Participant",
      },
    });
  });

  socket.on("call:answer", ({ targetSocketId, answer }) => {
    if (!targetSocketId || !answer) return;

    io.to(targetSocketId).emit("call:answer", {
      answer,
      fromSocketId: socket.id,
    });
  });

  socket.on("call:ice-candidate", ({ targetSocketId, candidate }) => {
    if (!targetSocketId || !candidate) return;

    io.to(targetSocketId).emit("call:ice-candidate", {
      candidate,
      fromSocketId: socket.id,
    });
  });

  // ====================================================
  // PLAY / PAUSE / SEEK
  // ====================================================

  socket.on("playback:update", (payload) => {
    const room = rooms.get(socket.roomCode);

    if (!room) return;

    const me = room.participants.get(socket.id);

    if (me?.role !== "Host") return;

    room.playback = {
      ...room.playback,
      ...payload,
    };

    io.to(socket.roomCode).emit("playback:update", room.playback);
  });

  // ====================================================
  // CHANGE YOUTUBE VIDEO
  // ====================================================

  socket.on("video:change", ({ videoId }) => {
    const room = rooms.get(socket.roomCode);

    if (!room || !videoId) return;

    const me = room.participants.get(socket.id);

    if (me?.role !== "Host") return;

    room.playback = {
      ...room.playback,
      videoId,
      playing: false,
      currentTime: 0,
    };

    io.to(socket.roomCode).emit("playback:update", room.playback);
  });

  // ====================================================
  // CHAT
  // ====================================================

  socket.on("chat:send", ({ text }) => {
    const room = rooms.get(socket.roomCode);

    if (!room || !text?.trim()) return;

    const me = room.participants.get(socket.id);

    const message = {
      id: randomUUID(),
      name: me?.name || "Guest",
      text: text.trim(),
      time: new Date().toLocaleTimeString(),
    };

    room.messages.push(message);

    io.to(socket.roomCode).emit("chat:new", message);
  });

  // ====================================================
  // RAISE HAND
  // ====================================================

  socket.on("raise-hand", () => {
    if (!socket.roomCode) return;

    io.to(socket.roomCode).emit("room:event", {
      type: "raise-hand",
      user: socket.user?.name,
    });
  });

  // ====================================================
  // REACTION
  // ====================================================

  socket.on("reaction", ({ value }) => {
    if (!socket.roomCode) return;

    io.to(socket.roomCode).emit("room:event", {
      type: "reaction",
      value,
      user: socket.user?.name,
    });
  });

  // ====================================================
  // WATCH PARTY LEAVE
  // ====================================================

  socket.on("room:leave", () => {
    const code = socket.roomCode;

    if (!code) return;

    const room = rooms.get(code);

    if (!room) return;

    room.participants.delete(socket.id);

    io.to(code).emit("call:peer-left", {
      socketId: socket.id,
    });

    socket.leave(code);

    io.to(code).emit("participants:update", [...room.participants.values()]);

    socket.roomCode = null;
    socket.user = null;
  });
  socket.on("participant:remove", ({ participantId }) => {
    const room = rooms.get(socket.roomCode);

    if (!room) return;

    const host = room.participants.get(socket.id);

    // Only host can remove a participant
    if (!host || host.role !== "Host") {
      return;
    }

    for (const [socketId, participant] of room.participants.entries()) {
      if (participant.id === participantId) {
        const targetSocket = io.sockets.sockets.get(socketId);

        if (targetSocket) {
          targetSocket.emit("participant:removed");

          targetSocket.leave(socket.roomCode);
          targetSocket.roomCode = null;
        }

        room.participants.delete(socketId);

        io.to(socket.roomCode).emit(
          "participants:update",
          Array.from(room.participants.values()),
        );

        break;
      }
    }
  });

  // ====================================================
  // STANDALONE MEETINGS
  // ====================================================

  socket.on("meeting:join", ({ meetingCode, user }) => {
    if (!meetingCode) return;

    const code = meetingCode.trim().toUpperCase();

    const meeting = getMeeting(code);

    const participant = {
      socketId: socket.id,

      id: user?.id || socket.authUser?._id?.toString(),

      name: user?.name || socket.authUser?.name || "Participant",
    };

    socket.meetingCode = code;

    meeting.participants.set(socket.id, participant);

    socket.join(`meeting:${code}`);

    for (const existing of meeting.participants.values()) {
      if (existing.socketId !== socket.id) {
        socket.emit("meeting:peer-ready", existing);
      }
    }

    socket.to(`meeting:${code}`).emit("meeting:peer-ready", participant);

    io.to(`meeting:${code}`).emit("meeting:participants", [
      ...meeting.participants.values(),
    ]);
  });

  socket.on("meeting:ready", () => {
    const code = socket.meetingCode;

    if (!code) return;

    const meeting = meetingRooms.get(code);

    if (!meeting) return;

    const participant = meeting.participants.get(socket.id);

    if (!participant) return;

    socket.to(`meeting:${code}`).emit("meeting:peer-ready", participant);
  });

  socket.on("meeting:leave", () => {
    const code = socket.meetingCode;

    if (!code) return;

    const meeting = meetingRooms.get(code);

    if (!meeting) return;

    meeting.participants.delete(socket.id);

    socket.to(`meeting:${code}`).emit("meeting:peer-left", {
      socketId: socket.id,
    });

    socket.leave(`meeting:${code}`);

    io.to(`meeting:${code}`).emit("meeting:participants", [
      ...meeting.participants.values(),
    ]);

    if (meeting.participants.size === 0) {
      meetingRooms.delete(code);
    }

    socket.meetingCode = null;
  });

  socket.on("meeting:offer", ({ targetSocketId, offer, from }) => {
    if (!targetSocketId || !offer) return;

    io.to(targetSocketId).emit("meeting:offer", {
      from: {
        socketId: socket.id,
        name: from?.name || socket.authUser?.name || "Participant",
      },

      offer,
    });
  });

  socket.on("meeting:answer", ({ targetSocketId, answer }) => {
    if (!targetSocketId || !answer) return;

    io.to(targetSocketId).emit("meeting:answer", {
      fromSocketId: socket.id,
      answer,
    });
  });

  socket.on("meeting:ice-candidate", ({ targetSocketId, candidate }) => {
    if (!targetSocketId || !candidate) return;

    io.to(targetSocketId).emit("meeting:ice-candidate", {
      candidate,
      fromSocketId: socket.id,
    });
  });

  // ====================================================
  // DISCONNECT
  // ====================================================

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const code = socket.roomCode;

    if (code) {
      const room = rooms.get(code);

      if (room) {
        room.participants.delete(socket.id);

        io.to(code).emit("call:peer-left", {
          socketId: socket.id,
        });

        if (room.hostId === socket.user?.id) {
          if (room.callActive) {
            room.callActive = false;

            io.to(code).emit("call:stopped");
          }

          const nextParticipant = [...room.participants.values()][0];

          room.hostId = nextParticipant?.id || null;

          if (nextParticipant) {
            nextParticipant.role = "Host";
          }
        }

        io.to(code).emit("participants:update", [
          ...room.participants.values(),
        ]);
      }
    }

    const meetingCode = socket.meetingCode;

    if (meetingCode) {
      const meeting = meetingRooms.get(meetingCode);

      if (meeting) {
        meeting.participants.delete(socket.id);

        io.to(`meeting:${meetingCode}`).emit("meeting:peer-left", {
          socketId: socket.id,
        });

        io.to(`meeting:${meetingCode}`).emit("meeting:participants", [
          ...meeting.participants.values(),
        ]);

        if (meeting.participants.size === 0) {
          meetingRooms.delete(meetingCode);
        }
      }
    }
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
