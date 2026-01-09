# Architecture Documentation

## Overview

Flash Chat is a real-time messaging application built as a monorepo containing both the client (frontend) and server (backend) code.

## Directory Structure

```
root/
├── frontend/           # React application (Vite)
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── server/             # Node.js/Express application
│   ├── index.js        # Main server entry point
│   ├── config.js       # Configuration
│   └── rateLimiter.js  # Rate limiting logic
├── tests/              # Integration and Unit tests
└── package.json        # Root dependencies and scripts
```

## Components

### Frontend (Client)
- **Framework**: React with Vite.
- **Styling**: Tailwind CSS.
- **State Management**: Local React state (useState, useEffect) + Socket.IO events.
- **Communication**: `socket.io-client` for real-time bi-directional communication with the server.
- **Encryption**: End-to-end encryption is simulated/implemented in the browser using Room ID as key (as per README).

### Backend (Server)
- **Runtime**: Node.js (Bun compatible).
- **Framework**: Express.js.
- **Real-time**: Socket.IO.
- **Persistence**: In-memory (RAM) for active sessions and volatile history. No persistent database (NoSQL/SQL) is currently used for message storage to ensure privacy/ephemerality.
- **Security**: 
  - `helmet` for HTTP headers.
  - Custom Rate Limiter.
  - CORS configuration.

## Data Flow

1.  **Connection**: Client connects via WebSocket (Socket.IO).
2.  **Room Join**: User joins a specific room (default: "general").
3.  **Messaging**:
    - Messages are sent via `socket.emit('message', payload)`.
    - Server validates and rate-limits the message.
    - Server broadcasts to other users in the room via `socket.to(room).emit('message', ...)`.
    - Server stores volatile history in RAM.
4.  **Media**: Images and Audio are sent as Base64 strings (with size limits).

## Deployment

- **Platform**: Render.
- **Build**: Frontend is built to static files (`frontend/dist`) and served by the Express backend.
- **Proxy**: Cloudflare handles DNS, SSL/TLS, and DDoS protection.
