# YouTube Watch Party — Setup Guide

## 1. Install required software

You need:

- Node.js 20 LTS or newer (includes npm)
- MongoDB Community Server running locally, OR a MongoDB Atlas connection string
- VS Code (recommended)
- A modern browser such as Chrome/Edge

You do **not** need to install `.NET` / `dotnet` for this project. The backend is Node.js + Express.

## 2. Install dependencies

Open the project folder in VS Code and use two terminals.

### Terminal 1 — Backend

```bash
cd server
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd client
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, normally:

`http://localhost:5173`

## 3. MongoDB

### Local MongoDB

Start MongoDB Community Server and keep it running. The server `.env` should contain a local URI such as:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/watch-party
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

### MongoDB Atlas

If using Atlas, put your Atlas connection string in `MONGODB_URI` instead.

## 4. Frontend environment

`client/.env` should contain:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 5. How to test the complete flow

1. Open the website.
2. Sign up / log in.
3. Dashboard → **Host a Watch Party**.
4. Enter meeting name and YouTube URL.
5. Click **Create Meeting & Get Invite Link**.
6. Copy the meeting code or link.
7. Share it through WhatsApp/Facebook/LinkedIn buttons.
8. Open the link in another browser/incognito window and log in with another account.
9. The participant joins using the code/link.
10. Host starts the Watch Party and can start the video call.

## 6. Important distinction

- Meeting Code: identifies the Watch Party room.
- Meeting Link: opens the Watch Party directly.
- YouTube Video Code: identifies the YouTube video being watched.

## 7. Production deployment

For deployment, update the environment variables with the real frontend/backend URLs and use a production MongoDB database. WebRTC calls can require a TURN server for reliable connections across restrictive NAT/firewall networks.

## 8. Do not upload secrets

Never commit real MongoDB passwords, JWT secrets, API keys, or private credentials to GitHub. Keep them in `.env` and add `.env` to `.gitignore`.
