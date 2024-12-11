import "./App.css";
import LandingPage from "./LandingPage.jsx";
import Message from "./Message.jsx";
import { Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/message" element={<Message />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </div>
  );
}

export default App;
