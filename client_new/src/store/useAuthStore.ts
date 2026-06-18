import { create } from "zustand";
import { toast } from "react-hot-toast";
import { io, type Socket } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import type { ApiResponse, AuthPayload, Credentials, SignupData, User } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  updatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { avatar: string }) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  updatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }

    try {
      const res = await axiosInstance.get<User>("/auth/check");
      set({ authUser: res.data });
      if (!get().socket) {
        get().connectSocket();
      }
    } catch (error) {
      localStorage.removeItem("token");
      set({ authUser: null });
      toast.error("Please login again");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<ApiResponse<AuthPayload>>(
        "/auth/signup",
        data,
      );
      localStorage.setItem("token", res.data.data.token);
      set({ authUser: res.data.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Unable to create account");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<ApiResponse<AuthPayload>>(
        "/auth/login",
        data,
      );
      localStorage.setItem("token", res.data.data.token);
      set({ authUser: res.data.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      toast.error("Logout request failed. You will be logged out locally.");
    } finally {
      localStorage.removeItem("token");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    }
  },

  updateProfile: async (data) => {
    set({ updatingProfile: true });
    try {
      const res = await axiosInstance.put<User>("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Profile update failed");
    } finally {
      set({ updatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    const token = localStorage.getItem("token");

    if (!authUser || !token || socket?.connected) {
      return;
    }

    const nextSocket = io(BASE_URL, {
      auth: { token },
    });

    nextSocket.connect();
    nextSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: nextSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
