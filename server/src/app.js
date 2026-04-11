import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import userRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
import contactRouter from "./routes/ContactRoutes.js";
import { app, server } from "./utils/socket.js";

dotenv.config({ path: "./config.env" });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const origin = process.env.CLIENT_URL;
const corsOptions = {
  origin,
  methods: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/auth/", userRouter);
app.use("/api/contacts/", contactRouter);
app.use("/api/messages/", messageRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
