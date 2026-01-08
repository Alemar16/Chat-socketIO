# Flash Chat

<p align="center">
  <img src="assets/images-project/Screenshot-2.png" alt="Texto alternativo 2" />
</p>

## Introduction

Flash Chat is a secure and anonymous chat application offering a revolutionary platform for communication. With a focus on user privacy, Flash Chat ensures that no data is stored once the session is closed, providing users with peace of mind during their conversations.

## Key Features

- **Secure and Anonymous Communication**: Users can choose to log in with a username or anonymously, with all data automatically deleted upon session closure.
- **Real-time Messaging**: Enjoy seamless real-time messaging with the help of Socket.IO, ensuring instant communication.
- **Internationalization (i18n)**: Fully translated into English and Spanish. Change languages instantly from the settings menu or the login screen.
- **Voice Messaging**: Record and send voice messages easily. Features a WhatsApp-style recording interface (Timer, Cancel) and a custom audio player with progress bar.
- **Image Sharing**: Share images with optional captions directly in the chat. Features include image preview before sending and a lightbox mode for viewing full-size images.
- **Enhanced Room Management**: Create private rooms, copy invitation links or Room IDs with a single click, and view a real-time list of connected users via the new Side Menu.
- **Smart Notifications**: Never miss a message. The app features a dual-notification system: a soft sound while you are active in the chat, and a distinct alert plus a System Notification when the app is in the background.
- **Performance & Cleanup**: Automatic message cleanup (keeping the last 100 messages) ensures the app remains fast and lightweight during long sessions.
- **Message Control**: Users can delete their own messages, providing better control over the conversation.
- **Modern UI/UX**: A completely responsive design that works perfectly on mobile and desktop. Features a centered desktop layout, glassmorphism effects, standard "Flash Chat" branding, and Light/Dark theme toggles.
- **Usage Recommendations**: Built-in guide with tips for secure and efficient usage.
- **Customizable Alerts**: Integration with SweetAlert2 enhances user experience with customizable alerts and notifications.
- **Easy Setup**: The project is divided into frontend and server directories, making setup hassle-free. Simply install dependencies with npm and run the project in development mode.
- **Security & Privacy (New)**:
  - **No-Log Policy**: The server does NOT store any logs of user activity, connections, or message metadata.
  - **Transparent Encryption**: All messages are encrypted in the browser using the Room ID as a key. The server only sees encrypted data.
  - **Volatile History**: A temporary history of text messages is kept in the server's RAM to help users catch up if they reload. This history is encrypted and is automatically deleted when the room becomes empty.
  - **Auto-Reconnection**: Smart logic to restore your session if your mobile device momentarily disconnects.

## Technologies Used

- React.js with Vite for frontend development
- Socket.IO for real-time communication
- i18next & react-i18next for Internationalization
- SweetAlert2 for enhanced user alerts
- Node.js and Express for backend development
- Tailwind CSS for styling
- Helmet for backend security headers
- Heroicons for a modern and consistent icon set
- date-fns for time formatting

## Infrastructure & Configuration

### 1. Server and Deployment (Backend)

- **Platform**: Hosted on **Render** (Node.js & Socket.io).
- **Status**: Active, with automatic deployment from GitHub.
- **Technical Address**: `chat-socketio-n9to.onrender.com` (Origin).

### 2. Domain & Validation

- **Domain**: `flashchat.website` (Registered via IONOS).
- **Validation**: ICANN identity verification completed.
- **Privacy**: Whois Privacy protection enabled.

### 3. DNS Configuration (IONOS → Render)

- **A Record**: Root (`@`) points to Render IP `216.24.57.1`.
- **CNAME**: `www` points to the Render technical URL.

### 4. Security Layer (Cloudflare)

- **Proxy**: Enabled (Orange Cloud) to mask server IP and provide DDoS protection.
- **SSL/TLS**: Set to **Full** encryption (User ↔ Cloudflare ↔ Render).
- **Nameservers**: Delegated to Cloudflare.

### 5. Real-Time Optimization

- **WebSockets**: Enabled on Cloudflare network to ensure stable socket connections.
- **HTTPS**: "Always Use HTTPS" enforced for all traffic.

### ✅ Current Status

- **Main URL**: [https://flashchat.website](https://flashchat.website)
- **Security**: Bank-grade SSL & DDoS Protection active.
- **Privacy**: Server IP hidden behind Cloudflare proxy.

## Getting Started

To begin using Flash Chat, ensure you have [Bun](https://bun.sh) installed on your system. Navigate to the project's root directory and run `bun install` to install dependencies for both backend and frontend. Then, start the project in development mode by running `bun run dev`.

If you prefer to run the frontend separately, you can navigate to the `frontend` folder and run `bun run dev`.

## Try It Out

Experience Flash Chat firsthand by visiting our live application at [https://flashchat.website](https://flashchat.website). We value your feedback and invite you to explore the application. Don't forget to star our GitHub repository to show your support!

## Application Screenshots

<p align="center">
<img src="assets/images-project/Screenshot-1.png" alt="Screenshot 1" width="800"/>
<img src="assets/images-project/Screenshot-4.png" alt="Screenshot 3" width="400" height="630"/>
<img src="assets/images-project/Screenshot-5.png" alt="Screenshot 4" width="400"/>
</p>

## Thank You for Your Support!

We extend our sincere gratitude to all users for choosing Flash Chat. Your continued support drives us to innovate and improve. Let's chat securely and anonymously together!
