import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar";
import InviteHandler from "./components/InviteHandler";
import { LandingPage, LoginPage, Message, Profile, SignupPage, Themes } from "./pages";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

type RedirectState = {
  from?: {
    pathname?: string;
    search?: string;
  };
};

function getRedirectPath(state: unknown) {
  const redirectState = state as RedirectState | null;
  const pathname = redirectState?.from?.pathname;

  if (!pathname) {
    return "/";
  }

  return `${pathname}${redirectState.from?.search || ""}`;
}

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const location = useLocation();
  const redirectPath = getRedirectPath(location.state);

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
          element={
            authUser ? (
              <InviteHandler />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
        <Route path="/" element={authUser ? <Message /> : <Navigate to="/login" />} />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={redirectPath} replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={redirectPath} replace />}
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
