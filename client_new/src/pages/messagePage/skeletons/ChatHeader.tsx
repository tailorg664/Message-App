import { Crown, Info, LogOut, Mail, Shield, Trash2, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import avatarImage from "/avatar.png";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    deleteChat,
    leaveGroup,
    updateGroupAccess,
  } = useChatStore();
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const [showInfo, setShowInfo] = useState(false);
  const [isUpdatingAccess, setIsUpdatingAccess] = useState(false);
  const participants = selectedUser?.participants || [];
  const sortedParticipants = useMemo(
    () =>
      [...participants].sort((first, second) => {
        if (first.role === second.role) {
          return first.fullname.localeCompare(second.fullname);
        }

        return first.role === "admin" ? -1 : 1;
      }),
    [participants],
  );

  if (!selectedUser) {
    return null;
  }

  const memberCount =
    selectedUser.connectionType === "group"
      ? selectedUser.participantIds.length +
        (authUser && !selectedUser.participantIds.includes(authUser._id) ? 1 : 0)
      : null;
  const isGroupChat = selectedUser.connectionType === "group";
  const isOnline = onlineUsers.includes(selectedUser._id);
  const chatStatus = isGroupChat ? "Active" : isOnline ? "Online" : "Offline";
  const displayedMemberCount = participants.length || memberCount || 0;
  const isCurrentUserAdmin = participants.some(
    (participant) =>
      participant._id === authUser?._id && participant.role === "admin",
  );
  const groupSettings = {
    membersCanEditInfo: selectedUser.settings?.membersCanEditInfo ?? false,
    membersCanInvite: selectedUser.settings?.membersCanInvite ?? true,
  };

  const handleDeleteChat = async () => {
    const success = await deleteChat(selectedUser._conversationId);
    if (success) {
      setShowInfo(false);
    }
  };

  const handleLeaveGroup = async () => {
    const success = await leaveGroup(selectedUser._conversationId);
    if (success) {
      setShowInfo(false);
    }
  };

  const handleAccessChange = async (
    accessKey: "membersCanEditInfo" | "membersCanInvite",
    value: boolean,
  ) => {
    setIsUpdatingAccess(true);
    await updateGroupAccess(selectedUser._conversationId, {
      editAccess:
        accessKey === "membersCanEditInfo" ? value : groupSettings.membersCanEditInfo,
      inviteAccess:
        accessKey === "membersCanInvite" ? value : groupSettings.membersCanInvite,
    });
    setIsUpdatingAccess(false);
  };

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
              {isGroupChat ? `${displayedMemberCount} members` : chatStatus}
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
                  {isGroupChat
                    ? "Your group chat information"
                    : "Your chat profile information"}
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
                  {isGroupChat
                    ? `${displayedMemberCount} members in this conversation`
                    : `${selectedUser.fullname} is ${chatStatus.toLowerCase()}`}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <User className="size-4" />
                    {isGroupChat ? "Group Name" : "Full Name"}
                  </div>
                  <p className="rounded-lg border border-base-content/50 bg-base-200 px-4 py-2.5">
                    {selectedUser.fullname}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    {isGroupChat ? (
                      <Info className="size-4" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                    {isGroupChat ? "Description" : "Email Address"}
                  </div>
                  <p className="rounded-lg border border-base-content/50 bg-base-200 px-4 py-2.5">
                    {isGroupChat
                      ? selectedUser.description || "No description"
                      : selectedUser.email || "Not available"}
                  </p>
                </div>
              </div>

              {isGroupChat && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-medium">Members</h3>
                    <span className="text-sm text-base-content/70">
                      {displayedMemberCount} users
                    </span>
                  </div>

                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {sortedParticipants.map((participant) => (
                      <div
                        key={participant._id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={participant.avatar || avatarImage}
                            alt={participant.fullname}
                            className="size-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {participant.fullname}
                              {participant._id === authUser?._id ? " (You)" : ""}
                            </div>
                            <div className="truncate text-xs text-base-content/60">
                              {participant.email || "No email"}
                            </div>
                          </div>
                        </div>

                        {participant.role === "admin" && (
                          <span className="badge badge-primary gap-1 shrink-0">
                            <Crown className="size-3" />
                            Admin
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isGroupChat && isCurrentUserAdmin && (
                <div className="space-y-4 rounded-lg border border-base-content/20 bg-base-200 p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5" />
                    <h3 className="text-lg font-medium">Member Access</h3>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between gap-4">
                    <span className="text-sm">Members can edit group info</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={groupSettings.membersCanEditInfo}
                      disabled={isUpdatingAccess}
                      onChange={(event) =>
                        void handleAccessChange(
                          "membersCanEditInfo",
                          event.target.checked,
                        )
                      }
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between gap-4">
                    <span className="text-sm">Members can invite users</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={groupSettings.membersCanInvite}
                      disabled={isUpdatingAccess}
                      onChange={(event) =>
                        void handleAccessChange(
                          "membersCanInvite",
                          event.target.checked,
                        )
                      }
                    />
                  </label>
                </div>
              )}

              <div className="rounded-xl bg-base-300 p-0 sm:p-2">
                <h3 className="mb-4 text-lg font-medium">Account Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-base-content/20 py-2">
                    <span>Chat Type</span>
                    <span>{isGroupChat ? "Group chat" : "Direct chat"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2">
                    <span>{isGroupChat ? "Group Status" : "Account Status"}</span>
                    <span
                      className={
                        chatStatus === "Offline" ? "text-base-content/60" : "text-green-500"
                      }
                    >
                      {chatStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {isGroupChat && (
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => void handleLeaveGroup()}
                  >
                    <LogOut className="size-4" />
                    Leave
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-error flex-1"
                  onClick={() => void handleDeleteChat()}
                >
                  <Trash2 className="size-4" />
                  Delete chat
                </button>
              </div>
            </div>
          </div>
          <div
            aria-label="Close chat info"
            role="button"
            tabIndex={0}
            className="modal-backdrop focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setShowInfo(false)}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault();
              }
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
