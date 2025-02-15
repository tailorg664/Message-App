import React from "react";
import { useChatStore } from "../../../store/useChatStore";
import ChatHeader from "../skeletons/ChatHeader";
import MessageInput from "../skeletons/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "../../../lib/utils.js";
import { useAuthStore } from "../../../store/useAuthStore";
function ChatBox() {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const messageEndRef = React.useRef(null);
  React.useEffect(() => {
    getMessages(selectedUser.id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [getMessages, selectedUser.id,subscribeToMessages,unsubscribeFromMessages]);
  React.useEffect(() => {
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[messages])
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            <div
              key={message.id}
              className={`chat ${
                message.senderId === authUser.id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm: max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>;
          })}
        </div>
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );
}

export default ChatBox;
