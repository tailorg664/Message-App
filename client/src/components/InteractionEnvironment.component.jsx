import React from 'react';
function InteractionEnvironment() {
      const [message, setMessage] = React.useState(null);
      const [inputMessage, setInputMessage] = React.useState(null);
  return (
    <div id="chat-window" className="flex-1 bg-gray-100 p-4 overflow-y-scroll">
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        <div className="ml-4">
          <div className="bg-white p-3 rounded-lg shadow-md">
            <p>{message}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">10:15 AM</span>
        </div>
      </div>

      <div className="flex items-end justify-end mb-4">
        <div className="mr-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md">
            <p>{inputMessage}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">10:16 AM</span>
        </div>
      </div>
    </div>
  );
}

export default InteractionEnvironment
