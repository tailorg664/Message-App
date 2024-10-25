import './App.css'
import React from 'react'
import UserChat from './components/UserChat.component'
import Search from './components/Search.component'
function App() {
const [message, setMessage] = React.useState(null);
const [inputMessage, setInputMessage] = React.useState(null);
  return (
    <div className="container bg-gray-200 m-3 ">
      <div className="semi-container issue01 -> there-is-no-border-radius flex h-screen border-red-600 border-2 rounded-xl">
        {/* chat section ..> Search Bar*/}
        <div className="chat-section w-1/4 bg-purple-400 border-r">
          {/* Search Bar */}
          <Search/>
          {/* User Chat */}
          <UserChat/>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="user-component-section bg-purple-400 p-4 flex items-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
            <div className="ml-4">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>

          <div
            id="chat-window"
            className="flex-1 bg-gray-100 p-4 overflow-y-scroll"
          >
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

          <div className="bg-gray-200 p-4 flex items-center">
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
        </div>
      </div>
    </div>
  );
}

export default App
