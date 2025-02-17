import UserContacts from "./Layouts/UserContacts.jsx";
import ChatBox from "./Layouts/ChatBox.jsx";
import {useChatStore} from "../../store/useChatStore";
import NoChatSelected from "./Layouts/NoChatSelected.jsx";
function Message() {
  const {selectedUser} = useChatStore()
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-8xl h-[calc(100vh-5rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <UserContacts />

            {!selectedUser ? <NoChatSelected /> : <ChatBox />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
