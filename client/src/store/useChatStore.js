import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/contacts/displayContacts");
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/getMessages/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket is null. Ensure it is initialized.");
      return;
    }
    socket.on("newMessage", (newMessage) => {
      // Check if the message is sent to the selected user
      const isMessageSentToSelectedUser =
        newMessage.sender === selectedUser._id;
      if (!isMessageSentToSelectedUser) return;
      // Add the new message to the messages array
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
  invitations: async (invitorUserId, invitedUserId) => {
    try {
      const res = await axiosInstance.post(
        "/contacts/addContact",
        invitorUserId,
        invitedUserId
      );
      set({ users: [...get().users, res.data.data] });
    } catch (error) {
      toast.error(error.message);
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
}));
