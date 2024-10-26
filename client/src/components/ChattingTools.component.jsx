import React from 'react'

function ChattingTools() {
      const [inputMessage, setInputMessage] = React.useState(null);
  return (
    <div className="bg-green-200 p-4 flex items-center">
      <input
        id="message-input"
        type="text"
        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        id="send-btn"
        onClick={() => setInputMessage(inputMessage)}
        className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}

export default ChattingTools
