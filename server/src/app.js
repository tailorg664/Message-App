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
app.use("/api/v1", userRouter);
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
