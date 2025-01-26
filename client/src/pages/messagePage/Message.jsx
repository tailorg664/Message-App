import UserContacts from "./Layouts/UserContacts.jsx";
import ChatBox from "./Layouts/ChatBox.jsx";
function Message() {
  return (
    <div className="message flex flex-row w-auto h-screen">
      <div className="user_contacts w-1/3 lg:w-1/5 bg-blue-500">
        <UserContacts />
      </div>
      <div className="chat_box w-2/3 lg:w-4/5 bg-green-400">
        <ChatBox />
      </div>
    </div>
  );
}

export default Message;
