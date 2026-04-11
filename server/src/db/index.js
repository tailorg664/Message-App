import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/messenger-app`);
    console.log(`database connected to ${process.env.MONGODB_URI}/messenger-app`);
  } catch (error) {
    console.log("Error occured while connecting to database : ", error);
  }
};

export default connectDB;
