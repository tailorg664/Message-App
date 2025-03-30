import "./App.css";
import {
  LandingPage,
  Message,
  LoginPage,
  SignupPage,
  Profile,
  Themes,
} from "./pages";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import InviteHandler from "./components/InviteHandler";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  // console.log({onlineUsers});

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/invite/:userId"
          element={authUser ? <InviteHandler /> : <Navigate to={"/login"} />}
        />

        <Route
          path="/"
          element={authUser ? <Message /> : <Navigate to={"/login"} />}
        />
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/themes" element={<Themes />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
