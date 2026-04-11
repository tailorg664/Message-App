import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Contact from "../model/ContactSchema.js";

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
  const sockets = userSocketMap[userId];
  return sockets ? [...sockets][0] : undefined;
}

function getOnlineUserIds() {
  return Object.keys(userSocketMap);
}

async function getRelatedUserIds(userId) {
  const contacts = await Contact.find({
    $or: [{ primaryUserId: userId }, { secondaryUserId: userId }],
  }).lean();

  return contacts
    .map((contact) => {
      if (!contact?.primaryUserId || !contact?.secondaryUserId) {
        return null;
      }

      return contact.primaryUserId.toString() === userId.toString()
        ? contact.secondaryUserId.toString()
        : contact.primaryUserId.toString();
    })
    .filter(Boolean);
}

async function emitOnlineContacts(userId) {
  const relatedUserIds = await getRelatedUserIds(userId);
  const onlineContacts = relatedUserIds.filter((relatedUserId) =>
    Boolean(userSocketMap[relatedUserId]),
  );

  const sockets = userSocketMap[userId];

  if (!sockets) {
    return;
  }

  for (const socketId of sockets) {
    io.to(socketId).emit("getOnlineUsers", onlineContacts);
  }
}

async function emitPresenceUpdates(userId) {
  const relatedUserIds = await getRelatedUserIds(userId);
  const affectedUsers = new Set([userId, ...relatedUserIds]);

  await Promise.all([...affectedUsers].map((affectedUserId) => emitOnlineContacts(affectedUserId)));
}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id);
  }

  try {
    if (userId) {
      await emitPresenceUpdates(userId);
    } else {
      socket.emit("getOnlineUsers", getOnlineUserIds());
    }
  } catch (error) {
    console.log("Error while sending online users:", error);
  }

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);

      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
    }

    try {
      if (userId) {
        await emitPresenceUpdates(userId);
      }
    } catch (error) {
      console.log("Error while updating online users on disconnect:", error);
    }
  });
});

export { app, server, io, getRecieverSocketId };
