const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
 const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/messenger-app`
    );
    console.log(`database connected to ${process.env.MONGODB_URI}/messenger-app`);
  } catch (error) {    
    console.log("Error occured while connecting to database :  ", error);
  }
};
module.exports = connectDB;