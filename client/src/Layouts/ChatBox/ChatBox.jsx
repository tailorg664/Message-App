import React, {useState} from "react";
import attach from "../../assets/attach.png";
import emoji from "../../assets/emoji.png";
import microphone from "../../assets/microphone.png";
import './ChatBox.css';
function ChatBox() {
  // State for managing input message
  const [message, setMessage] = useState("");

  // State for storing messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user" },
    { id: 2, text: "Hi there!", sender: "other" },
  ]);

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
     <div className="input-area">
       <div className="emoji pl-2 pr-1">
         <img src={emoji} alt="" />
       </div>
       <div className="attach pr-1">
         <img src={attach} alt="" />
       </div>
       <input
         type="text"
         placeholder="Type a message..."
         className="input"
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         onKeyPress={(e) => e.key === "Enter" && sendMessage()}
       />
       <div className="microphone pr-1">
         <img src={microphone} alt="" />
       </div>
       
     </div>
   </div>
 );
 
}

export default ChatBox