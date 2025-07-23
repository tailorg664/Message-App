const express = require("express");
const {app,server} = require("../src/utils/socket")
const cors = require("cors");
const connectDB = require("./db/index");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// database connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch(() => console.log("Error occured while connecting to database"));
//port connection
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//cors connection
const origin = process.env.CLIENT_URL
const corsOptions = {
  origin: origin,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
//route connection
const userRouter = require("./routes/UserRoutes");
const messageRouter = require("./routes/MessageRoutes");
const contactRouter = require("./routes/ContactRoutes");
app.use("/api/auth/", userRouter);
app.use("/api/contacts/", contactRouter);
app.use("/api/messages/", messageRouter);

//hosting
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
