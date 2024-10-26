import React from 'react'
import './Contact.css'
function Contact() {
  return (
    <div className="chat-item flex  p-2 mb-4 cursor-pointer hover:bg-purple-500 ">
      <div className="avatar w-10 h-10 bg-purple-900 rounded-full"></div>
      <div className="name-status-message ml-4">
        <h3 className="name font-semibold ">Name of User</h3>
        <p className="message text-sm  ">Message....</p>
      </div>
      <h4 className="time-status pl-16 ">00:00</h4>
    </div>
  );
}

export default Contact
