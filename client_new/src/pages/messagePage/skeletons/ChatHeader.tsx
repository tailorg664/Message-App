import { X } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.avatar || "/avatar.png"}
                alt={selectedUser.fullname}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser.connectionType === "group"
                ? `${selectedUser.participantIds.length} members`
                : onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null, null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
