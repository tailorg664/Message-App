function UserChat() {
  return (
    <div className="user-chat overflow-y-auto h-full">
      <div className="chat-item flex  p-2 mb-4 cursor-pointer hover:bg-purple-500 ">
        <div className="avatar w-12 h-12 bg-purple-900 rounded-full"></div>
        <div className="name-status-message ml-4">
          <h3 className="name font-semibold ">Name of User</h3>
          <p className="message text-sm  ">Message....</p>
        </div>
        <h4 className="time-status pl-40 ">00:00</h4>
      </div>
    </div>
  );
}

export default UserChat
