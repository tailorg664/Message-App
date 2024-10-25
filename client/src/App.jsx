import './App.css'
import React from 'react'
import UserChat from './components/UserChat.component'
import Search from './components/Search.component'
import InteractorComponent from './components/InteractorComponent.component'
import InteractionEnvironment from './components/InteractionEnvironment.component'
import ChattingTools from './components/ChattingTools.component'
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
        {/* Interaction Section */}
        <div className="flex-1 flex flex-col">\
          
          <InteractorComponent/>

          <InteractionEnvironment/>

          <ChattingTools/>
        </div>
      </div>
    </div>
  );
}

export default App
