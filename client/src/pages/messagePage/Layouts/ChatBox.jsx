import { useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
function ChatBox() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const sendMessage = () => {
    if (message.trim() !== "") {
      // Append the new message to the messages array
      setMessages([
        ...messages,
        { id: messages.length + 1, text: message, sender: "user" },
      ]);
      setMessage(""); // Clear the input field
    }
  };
  return (
    <div className="chat-box">
      {/* Messages Display Area */}
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === "user" ? "user-message" : "other-message"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="inputArea absolute bottom-0  w-[1228.8px]">
        <div className="inputBox flex flex-row justify-evenly w-full">
          <div className="emoji pl-2 pr-1">
            <img src={emoji} alt="" />
          </div>
          <div className="attach pr-1">
            <img src={attach} alt="" />
          </div>
          <div className="inputBox w-[1100px]">
            <input
              type="text"
              placeholder="Type a message..."
              className="input w-full bg-blue-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>

          <div className="microphone">
            <img src={microphone} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
