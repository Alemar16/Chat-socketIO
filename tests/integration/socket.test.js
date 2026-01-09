import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import { io as ioClient } from "socket.io-client";
import { server, io as ioServer } from "../../server/index.js";

describe("Socket.IO Integration", () => {
  let clientSocket;
  let clientSocket2;
  let port;

  beforeAll(async () => {
    // Start server on random port
    await new Promise((resolve, reject) => {
        server.listen(0, (err) => {
            if (err) return reject(err);
            port = server.address().port;
            resolve();
        });
    });
  });

  afterAll(async () => {
    // Force close socket.io server
    ioServer.close();
    
    // Close HTTP server if listening
    if (server.listening) {
        await new Promise((resolve) => {
            server.close((err) => {
                // Ignore error if server is already closed
                resolve(); 
            });
            // Force resolve if it takes too long
            setTimeout(resolve, 1000); 
        });
    }
  });

  beforeEach(async () => {
    // Setup client
    clientSocket = ioClient(`http://localhost:${port}`);
    clientSocket2 = ioClient(`http://localhost:${port}`);
    
    // Wait for both to connect
    await new Promise((resolve) => {
        let connectedCount = 0;
        const onConnect = () => {
            connectedCount++;
            if (connectedCount === 2) resolve();
        };

        clientSocket.on("connect", onConnect);
        clientSocket2.on("connect", onConnect);
    });
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) clientSocket.disconnect();
    if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
    clientSocket = null;
    clientSocket2 = null;
  });

  it("should allow a client to login and join a room", (done) => {
    const username = "User1";
    const roomId = "general";

    clientSocket.emit("login", { username, roomId });

    // Listen for "users" event which is emitted to the room on login/update
    // Note: The current implementation emits "users" to the room via updateConnectedUsers
    clientSocket.on("users", (users) => {
      try {
        expect(users).toBeInstanceOf(Array);
        const user = users.find(u => u.username === username);
        expect(user).toBeDefined();
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("should broadcast messages to other users in the room", (done) => {
    const roomId = "room1";
    const message = "Hello World";

    // Login both clients to same room
    clientSocket.emit("login", { username: "Sender", roomId });
    clientSocket2.emit("login", { username: "Receiver", roomId });

    // Wait a bit for joins to process
    setTimeout(() => {
        clientSocket2.on("message", (payload) => {
            try {
                expect(payload.body).toBe(message);
                expect(payload.from).toBe("Sender");
                done();
            } catch (err) {
                done(err);
            }
        });

        clientSocket.emit("message", message);
    }, 50);
  });

  it("should enforce rate limiting on messages", async () => {
    const roomId = "spam-room";
    clientSocket.emit("login", { username: "Spammer", roomId });
    clientSocket2.emit("login", { username: "Victim", roomId });

    await new Promise(r => setTimeout(r, 50));

    let messageCount = 0;
    clientSocket2.on("message", () => {
        messageCount++;
    });

    // Send 10 messages (Limit is 5 per sec)
    for (let i = 0; i < 10; i++) {
        clientSocket.emit("message", `Msg ${i}`);
    }

    // Wait for processing
    await new Promise(r => setTimeout(r, 500));

    // Should receive max 5 (or 6 depending on initial check)
    // RateLimiter limit is 5.
    expect(messageCount).toBeLessThanOrEqual(6); 
  });

  it("should broadcast image messages and enforce size limits", (done) => {
    const roomId = "media-room";
    clientSocket.emit("login", { username: "Sender", roomId });
    clientSocket2.emit("login", { username: "Receiver", roomId });

    setTimeout(() => {
        // Test 1: Valid Image
        const validImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        
        clientSocket2.on("message", (payload) => {
            try {
                expect(payload.type).toBe("image");
                expect(payload.body).toBe(validImage);
                // Proceed to Test 2: Invalid (Too Large) Image
                testLargeImage();
            } catch (err) {
                done(err);
            }
        });

        clientSocket.emit("image", { body: validImage, id: "img1" });
    }, 50);

    function testLargeImage() {
        // Remove previous listener
        clientSocket2.off("message");
        
        let receivedLarge = false;
        clientSocket2.on("message", () => {
            receivedLarge = true;
        });

        // Create a fake large image string (> 7MB)
        const largeImage = "a".repeat(7000001); 
        clientSocket.emit("image", { body: largeImage, id: "img2" });

        setTimeout(() => {
            try {
                expect(receivedLarge).toBe(false); // Should NOT have received it
                done();
            } catch (err) {
                done(err);
            }
        }, 200);
    }
  });

  it("should handle reactions (add and toggle)", (done) => {
    const roomId = "reaction-room";
    const msgId = "msg-to-react";
    
    clientSocket.emit("login", { username: "Reactor", roomId });
    clientSocket2.emit("login", { username: "Observer", roomId });

    setTimeout(() => {
        // 1. Send initial message to populate history
        clientSocket.emit("message", { body: "React to me", id: msgId });
        
        setTimeout(() => {
            // 2. React to the message
            clientSocket.emit("reaction", { messageId: msgId, emoji: "👍" });
        }, 50);
    }, 50);

    // Listen for reaction updates
    clientSocket2.on("reaction_update", (payload) => {
        try {
            expect(payload.messageId).toBe(msgId);
            // Verify reaction added
            if (payload.reactions["Reactor"] === "👍") {
                done();
            }
        } catch (err) {
            done(err);
        }
    });
  });

  it("should send history to new user joining a room", (done) => {
    const roomId = "history-room";
    const historyMsg = "Historic Message";

    // 1. User 1 joins and sends a message
    clientSocket.emit("login", { username: "Pioneer", roomId });
    
    setTimeout(() => {
        clientSocket.emit("message", historyMsg);

        setTimeout(() => {
            // 2. User 2 joins LATER
            clientSocket2.emit("login", { username: "Newcomer", roomId });
        }, 50);
    }, 50);

    // 3. User 2 should receive history
    clientSocket2.on("history", (history) => {
        try {
            expect(history).toBeInstanceOf(Array);
            expect(history.length).toBeGreaterThan(0);
            expect(history[0].body).toBe(historyMsg);
            done();
        } catch (err) {
            done(err);
        }
    });
  });
});
