const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/index");
// database connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch(() => console.log("Error occured while connecting to database"));
//socket initialization
const { initializeSocket } = require("./utils/socket");
const server = http.createServer(app);
initializeSocket(server);
//port connection
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend's origin
    methods: ["GET", "POST"], // Allow the required HTTP methods
    allowedHeaders: ["Content-Type"], // Allow specific headers
  })
);
//route connection
const userRouter = require("./routes/UserRoutes");
const messageRouter = require("./routes/MessageRoutes");
const contactRouter = require("./routes/ContactRoutes");
app.use("/api/auth", userRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);

//hosting
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/api/v1");
});
