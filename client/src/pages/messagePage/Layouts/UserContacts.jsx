import React from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import { Users } from "lucide-react";

function UserContacts() {
  const { getUsers, users, setSelectedUser, selectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  React.useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <aside
      className={`h-full w-20 border-r border-base-300 flex flex-col transition-all duration-200 ${
        isCollapsed ? "lg:w-20" : "lg:w-72"
      }`}
    >
      <div className="border-b border-base-300 w-full p-5">
        <button
          type="button"
          aria-label={isCollapsed ? "Expand contacts" : "Collapse contacts"}
          aria-expanded={!isCollapsed}
          className={`flex w-full items-center gap-2 rounded-md transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
            isCollapsed ? "lg:justify-center" : ""
          }`}
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
        >
          <Users className="size-6" />
          <span
            className={`font-medium ${
              isCollapsed ? "hidden" : "hidden lg:block"
            }`}
          >
            Contacts
          </span>
        </button>
        {/* online filter optimization */}
        <div
          className={`mt-3 item-center gap-2 ${
            isCollapsed ? "hidden" : "hidden lg:flex"
          }`}
        >
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm ">Show online only.</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className={`relative mx-auto ${isCollapsed ? "" : "lg:mx-0"}`}>
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div
              className={`text-left min-w-0 ${
                isCollapsed ? "hidden" : "hidden lg:block"
              }`}
            >
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div
            className={`text-center text-zinc-500 py-4 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            No online users
          </div>
        )}
      </div>
    </aside>
  );
}

export default UserContacts;
