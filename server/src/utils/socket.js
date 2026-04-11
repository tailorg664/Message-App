import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const app = express();
const server = http.createServer(app);
const localClientURL = process.env.CLIENT_URL_LOCAL || "http://localhost:5173";
const mainClientURL = process.env.CLIENT_URL_MAIN;
const io = new Server(server, {
  cors: {
    origin: [localClientURL, mainClientURL],
  },
});

const userSocketMap = {};

function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io, getRecieverSocketId };
