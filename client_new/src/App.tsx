import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar";
import InviteHandler from "./components/InviteHandler";
import { LandingPage, LoginPage, Message, Profile, SignupPage, Themes } from "./pages";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    void checkAuth();
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
          path="/invite/:inviteValue"
          element={authUser ? <InviteHandler /> : <Navigate to="/login" />}
        />
        <Route path="/" element={authUser ? <Message /> : <LandingPage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/themes" element={<Themes />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
