import { Info, Mail, User, X } from "lucide-react";
import { useState } from "react";
import avatarImage from "/avatar.png";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showInfo, setShowInfo] = useState(false);

  if (!selectedUser) {
    return null;
  }

  const chatStatus = onlineUsers.includes(selectedUser._id) ? "Online" : "Offline";

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.avatar || "/avatar.png"}
                alt={selectedUser.fullname}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {chatStatus}
            </p>
          </div>
        </div>

        {/* Close button */}
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
            onClick={() => setSelectedUser(null)}
          >
            <X />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl bg-base-300 p-0">
            <div className="relative p-6 sm:p-8 space-y-8">
              <button
                aria-label="Close chat info"
                className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
                onClick={() => setShowInfo(false)}
              >
                <X className="size-5" />
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-semibold">Profile</h2>
                <p className="mt-2 text-base-content/70">
                  Your chat profile information
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedUser.avatar || avatarImage}
                    alt={selectedUser.fullname}
                    className="size-32 rounded-full object-cover border-4 border-base-content/80"
                  />
                </div>
                <p className="text-sm text-base-content/70">
                  {selectedUser.fullname} is {chatStatus.toLowerCase()}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <User className="size-4" />
                    Full Name
                  </div>
                  <p className="rounded-lg border border-base-content/50 bg-base-200 px-4 py-2.5">
                    {selectedUser.fullname}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Mail className="size-4" />
                    Email Address
                  </div>
                  <p className="rounded-lg border border-base-content/50 bg-base-200 px-4 py-2.5">
                    {selectedUser.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-base-300 p-0 sm:p-2">
                <h3 className="mb-4 text-lg font-medium">Account Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-base-content/20 py-2">
                    <span>Chat Type</span>
                    <span>Direct chat</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2">
                    <span>Account Status</span>
                    <span
                      className={
                        chatStatus === "Offline"
                          ? "text-base-content/60"
                          : "text-green-500"
                      }
                    >
                      {chatStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            aria-label="Close chat info"
            className="modal-backdrop"
            onClick={() => setShowInfo(false)}
          />
        </div>
      )}
    </div>
  );
};
export default ChatHeader;
