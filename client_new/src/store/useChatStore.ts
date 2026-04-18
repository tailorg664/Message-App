import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { getConversationListItem } from "../lib/utils";
import type {
  ApiResponse,
  ContactConnection,
  ConversationListItem,
  Message,
  MessageDeletedEvent,
} from "../types";

interface ChatState {
  messages: Message[];
  users: ConversationListItem[];
  selectedUser: ConversationListItem | null;
  selectedConversationId: string | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (conversationId: string) => Promise<void>;
  sendMessage: (messageData: { content: string; image: string | null }) => Promise<void>;
  addFriendByEmail: (email: string) => Promise<boolean>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (
    selectedUser: ConversationListItem | null,
    conversationId?: string | null,
  ) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedConversationId: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) {
      set({ users: [], isUsersLoading: false });
      return;
    }

    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<ApiResponse<ContactConnection[]>>(
        "/contacts/display-friend-connections",
      );
      const users = res.data.data
        .map((connection) => getConversationListItem(connection, authUser._id))
        .filter((user): user is ConversationListItem => Boolean(user));

      set({ users });
    } catch (error) {
      toast.error("Unable to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (conversationId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<ApiResponse<Message[]>>(
        `/messages/get-messages/${conversationId}`,
      );
      set({ messages: res.data.data });
    } catch (error) {
      toast.error("Unable to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedConversationId, messages } = get();
    if (!selectedConversationId) {
      return;
    }

    try {
      const res = await axiosInstance.post<ApiResponse<Message>>(
        `/messages/send-message/${selectedConversationId}`,
        messageData,
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error("Unable to send message");
    }
  },

  addFriendByEmail: async (email) => {
    try {
      await axiosInstance.post("/contacts/add-friend", { email });
      toast.success("Contact added");
      await get().getUsers();
      return true;
    } catch (error) {
      toast.error("Unable to add contact");
      return false;
    }
  },

  subscribeToMessages: () => {
    const { selectedConversationId } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedConversationId || !socket) {
      return;
    }

    socket.on("newMessage", (newMessage: Message) => {
      if (newMessage.conversationId !== selectedConversationId) {
        return;
      }

      set({
        messages: get().messages.some((message) => message._id === newMessage._id)
          ? get().messages
          : [...get().messages, newMessage],
      });
    });

    socket.on("messageUpdated", (updatedMessage: Message) => {
      if (updatedMessage.conversationId !== selectedConversationId) {
        return;
      }

      set({
        messages: get().messages.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      });
    });

    socket.on("messageDeleted", ({ messageId, conversationId }: MessageDeletedEvent) => {
      if (conversationId !== selectedConversationId) {
        return;
      }

      set({
        messages: get().messages.filter((message) => message._id !== messageId),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    socket?.off("messageUpdated");
    socket?.off("messageDeleted");
  },

  setSelectedUser: (selectedUser, conversationId = null) =>
    set({
      selectedUser,
      selectedConversationId: conversationId,
    }),
}));
