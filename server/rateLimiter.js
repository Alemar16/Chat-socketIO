export class RateLimiter {
  constructor(limit = 5, timeWindow = 1000) {
    this.limit = limit; // Max connections/messages
    this.timeWindow = timeWindow; // Time window in ms
    this.clients = new Map();
  }

  check(clientId) {
    const now = Date.now();
    const clientData = this.clients.get(clientId) || { count: 0, startTime: now };

    // Reset window if time passed
    if (now - clientData.startTime > this.timeWindow) {
      clientData.count = 0;
      clientData.startTime = now;
    }

    if (clientData.count < this.limit) {
      clientData.count++;
      this.clients.set(clientId, clientData);
      return true; // Allowed
    }

    return false; // Blocked
  }

  cleanup(clientId) {
    this.clients.delete(clientId);
  }
}
