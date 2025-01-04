const sendNotification = (receiver, message) => {
  const io = require("../utils/socket");
  io.to(receiver).emit("newMessage", message);
};
module.exports = sendNotification;
