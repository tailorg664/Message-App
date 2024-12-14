import "./App.css";
import { LandingPage, Message, LoginPage, SignupPage } from "./pages";
import { Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/message" element={<Message />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </div>
  );
}

export default App;
