// Import necessary modules
const { Server } = require("socket.io");

let io; // To hold the Socket.IO instance

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Replace '*' with your client URL for production
      methods: ["GET", "POST"],
    },
  });

  // Handle connection event
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Custom events can be defined here
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error(
      "Socket.IO is not initialized. Please call initializeSocket() first."
    );
  }
  return io;
};

module.exports = { initializeSocket, getSocketInstance };
