const express = require("express");
const app = express();
const connectDB = require("./db/index");
// database connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch(() => console.log("Error occured while connecting to database"));
//port connection
app.use(express.json());
//route connection
const userRouter = require("./routes/UserRoutes");
const messageRouter = require("./routes/MessageRoutes");
app.use("/api/v1", userRouter);
app.use("/api/v1/messages", messageRouter);

//hosting
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
