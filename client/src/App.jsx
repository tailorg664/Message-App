import "./App.css";
import React from "react";
import UserInfo from "./Layouts/UserInfo/UserInfo.jsx";
import UserContacts from "./Layouts/UserContacts/UserContacts.jsx";
import ChatBox from "./Layouts/ChatBox/ChatBox.jsx";
function App() {
  return (
    <div className="container">
      <div className="user_info bg-white">
        <UserInfo />
      </div>
      <div className="user_contacts bg-blue-500">
        <UserContacts />
      </div>
      <div className="chat_box bg-green-400">
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
