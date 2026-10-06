# 🎥 Project Meeting — YouTube Watch Party & Video Meetings

A full-stack real-time web application that provides two major features:

- 🎬 **Watch Party** — Watch YouTube videos together with other users in real time.
- 📹 **Meetings** — Create or join standalone video meetings using a unique meeting code.

The project is built using **React, Vite, Node.js, Express.js, Socket.IO, WebRTC, and MongoDB**.

---

# 🌐 Project Overview

**Project Meeting** is a real-time communication platform designed for watching videos together and conducting online video meetings.

The application provides two separate experiences.

## 🎬 Watch Party

Users can create or join a Watch Party room and watch a YouTube video together.

The video playback is synchronized between participants using **Socket.IO**.

Users can communicate through real-time chat, reactions, raise-hand functionality, and an optional video call.

## 📹 Standalone Meetings

Users can create or join a standalone video meeting without any YouTube video.

Meetings use **WebRTC** for real-time audio and video communication, while **Socket.IO** is used for signaling and participant communication.

---

# ✨ Features

## 🎬 Watch Party Features

- Create Watch Party room
- Join Watch Party using room code
- YouTube video playback
- Real-time play synchronization
- Real-time pause synchronization
- Real-time seek synchronization
- Change YouTube video
- Host controls
- Participant list
- Real-time chat
- Reactions
- Raise hand
- Optional video call
- Invite participants
- Room-based communication
- Leave room

---

## 📹 Standalone Meeting Features

- Create a new meeting
- Automatically generate a unique meeting code
- Join meeting using meeting code
- Meeting link sharing
- Meeting code sharing
- Real-time participant list
- Camera on/off
- Microphone on/off
- WebRTC video communication
- Real-time audio communication
- Invite participants
- Leave meeting

---

# 👥 Watch Party Roles

The Watch Party supports different participant roles.

## 👑 Host

The Host is the creator of the Watch Party.

The Host can:

- Play the video
- Pause the video
- Seek the video
- Change the YouTube video
- Manage the Watch Party
- Start and stop the optional video call

---

## 🛡️ Moderator

A Moderator can be assigned by the Host.

The Moderator role is designed to help manage the Watch Party and can be extended with additional permissions in future versions.

---

## 👤 Participant

Participants are normal users who join the Watch Party.

They can:

- Watch the video
- Send messages
- Send reactions
- Raise hand
- Join the optional video call

---

# 🔄 Complete Website Flow

```text
                         PROJECT MEETING
                                │
                                ▼
                       ┌─────────────────┐
                       │  Login / Signup │
                       └────────┬────────┘
                                │
                                ▼
                         ┌────────────┐
                         │ Dashboard  │
                         └─────┬──────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
          🎬 Watch Party                 📹 Meetings
                 │                           │
                 ▼                           ▼
            Create / Join                Create / Join
                 │                           │
                 ▼                           ▼
             Room Code                  Meeting Code
                 │                           │
                 ▼                           ▼
         YouTube Watch Room            Video Meeting
                 │                           │
                 ▼                           ▼
             Socket.IO              WebRTC + Socket.IO
                 │                           │
                 ▼                           ▼
          Real-Time Users             Real-Time Users


          PROJECT STRUCTURE


     project_meeting/
│
├── client/                              # Frontend - React + Vite
│   │
│   ├── src/
│   │   │
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── Chat.jsx                 # Real-time chat UI
│   │   │   ├── ConnectionStatus.jsx     # Socket connection status
│   │   │   ├── MeetingCall.jsx          # Standalone meeting video call
│   │   │   ├── MeetingControls.jsx      # Watch Party controls
│   │   │   ├── Participants.jsx         # Participants list
│   │   │   ├── VideoCall.jsx            # Watch Party video call
│   │   │   └── VideoPlayer.jsx          # YouTube video player
│   │   │
│   │   ├── context/                     # Global application state
│   │   │   ├── AuthContext.jsx          # Login/signup/user authentication
│   │   │   └── RoomContext.jsx          # Watch Party room & socket state
│   │   │
│   │   ├── pages/                       # Main application pages
│   │   │   ├── Dashboard.jsx            # Main user dashboard
│   │   │   ├── Meetings.jsx             # Create / Join Meeting page
│   │   │   ├── MeetingRoom.jsx          # Standalone video meeting
│   │   │   ├── WatchRoom.jsx             # YouTube Watch Party room
│   │   │   └── ...                      # Other application pages
│   │   │
│   │   ├── services/                    # Backend communication
│   │   │   ├── api.js                   # REST API requests
│   │   │   └── socket.js                # Socket.IO connection
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js               # Helper functions
│   │   │
│   │   ├── App.jsx                      # Main React application & routes
│   │   └── main.jsx                     # React application entry point
│   │
│   ├── public/                          # Static frontend assets
│   ├── .env                             # Frontend environment variables
│   ├── .gitignore                       # Frontend Git ignore rules
│   ├── package.json                     # Frontend dependencies & scripts
│   └── vite.config.js                   # Vite configuration
│
│
├── server/                              # Backend - Node.js + Express
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── database.js              # MongoDB connection
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT authentication middleware
│   │   │
│   │   ├── models/
│   │   │   ├── User.js                  # User database model
│   │   │   ├── Room.js                  # Watch Party room model
│   │   │   └── Message.js               # Chat message model
│   │   │
│   │   └── index.js                     # Main backend server
│   │
│   ├── .env                             # Backend secrets & configuration
│   ├── .gitignore                       # Backend Git ignore rules
│   └── package.json                     # Backend dependencies & scripts
│
│
├── .gitignore                           # Root Git ignore rules
├── README.md                            # Project documentation
└── SETUP.md                             # Project setup instructions     