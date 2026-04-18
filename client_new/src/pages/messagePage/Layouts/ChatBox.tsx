import { useEffect, useRef } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import ChatHeader from "../skeletons/ChatHeader";
import MessageInput from "../skeletons/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "../../../lib/utils";

function ChatBox() {
  const authUser = useAuthStore((state) => state.authUser);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    selectedConversationId,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    void getMessages(selectedConversationId);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    selectedConversationId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!authUser || !selectedUser) {
    return null;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isImageMessage = message.content.startsWith("http");

          return (
            <div
              key={message._id}
              className={`chat ${
                message.sender === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.sender === authUser._id
                        ? authUser.avatar || "/avatar.png"
                        : selectedUser.avatar || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {isImageMessage ? (
                  <img
                    src={message.content}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md"
                  />
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatBox;
