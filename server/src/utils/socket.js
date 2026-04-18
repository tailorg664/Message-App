import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Conversation from "../model/ConversationSchema.js";

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

io.use((socket, next) => {
  try {
    const rawToken = socket.handshake.auth?.token;

    if (!rawToken) {
      return next(new Error("Unauthorized"));
    }

    const token = rawToken.startsWith("Bearer ")
      ? rawToken.replace("Bearer ", "")
      : rawToken;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decodedToken?._id) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = decodedToken._id.toString();
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
});

async function getRelatedUserIds(userId) {
  const conversations = await Conversation.find({
    "participants.user": userId,
  })
    .select("participants.user")
    .lean();

  const relatedUserIds = new Set();

  for (const conversation of conversations) {
    for (const participant of conversation.participants || []) {
      const participantId = participant?.user?.toString();

      if (participantId && participantId !== userId.toString()) {
        relatedUserIds.add(participantId);
      }
    }
  }

  return [...relatedUserIds];
}

async function joinUserConversationRooms(socket, userId) {
  const conversations = await Conversation.find({
    "participants.user": userId,
  })
    .select("_id")
    .lean();

  for (const conversation of conversations) {
    socket.join(conversation._id.toString());
  }
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
  const userId = socket.data.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id);
  }

  try {
    if (userId) {
      await joinUserConversationRooms(socket, userId);
      await emitPresenceUpdates(userId);
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
