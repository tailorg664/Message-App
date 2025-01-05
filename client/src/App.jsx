import "./App.css";
import { LandingPage, Message, LoginPage, SignupPage } from "./pages";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
function Navbar() {
  return (
    <div className="w-full h-12 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="icon">icon</div>
      <div className="">settings</div>
    </div>
  );
}
function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log(authUser);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/message"
          element={authUser ? <Message /> : <Navigate to={"/login"} />}
        />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/message"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/message"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
