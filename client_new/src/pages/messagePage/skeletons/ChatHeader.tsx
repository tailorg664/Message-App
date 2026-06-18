import { Info, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const [showInfo, setShowInfo] = useState(false);

  if (!selectedUser) {
    return null;
  }

  const memberCount =
    selectedUser.connectionType === "group"
      ? selectedUser.participantIds.length +
        (authUser && !selectedUser.participantIds.includes(authUser._id) ? 1 : 0)
      : null;

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
                ? `${memberCount} members`
                : onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Show chat info"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowInfo(true)}
          >
            <Info className="size-5" />
          </button>
          <button
            aria-label="Close chat"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setSelectedUser(null, null)}
          >
            <X />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Chat Info</h3>
            <div className="py-4 space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {selectedUser.fullname}
              </p>
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {selectedUser.connectionType === "group" ? "Group chat" : "Direct chat"}
              </p>
              {selectedUser.connectionType === "group" ? (
                <>
                  <p>
                    <span className="font-semibold">Members:</span> {memberCount}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedUser.description || "No description"}
                  </p>
                </>
              ) : (
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedUser.email || "Not available"}
                </p>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowInfo(false)}>
                Close
              </button>
            </div>
          </div>
          <div
            aria-label="Close chat info"
            role="button"
            tabIndex={0}
            className="modal-backdrop"
            onClick={() => setShowInfo(false)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "Escape"
              ) {
                setShowInfo(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
