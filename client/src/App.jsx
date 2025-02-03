import "./App.css";
import { LandingPage, Message, LoginPage, SignupPage, Profile } from "./pages";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth,authUser]);
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
