export type ThemeName =
  | "light"
  | "dark"
  | "retro"
  | "cupcake"
  | "emerald"
  | "aqua"
  | "luxury"
  | "lemonade";

export interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface ContactUser extends User {
  _conversationId: string;
}

export interface ConversationListItem {
  _id: string;
  _conversationId: string;
  connectionType: "friend" | "group";
  fullname: string;
  email?: string;
  avatar?: string;
  participantIds: string[];
  participants?: ConversationParticipant[];
  description?: string | null;
  settings?: GroupSettings;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface GroupMetadata {
  name?: string | null;
  icon?: string | null;
  description?: string | null;
  createdBy?: string | null;
  settings?: GroupSettings;
}

export interface GroupSettings {
  membersCanEditInfo: boolean;
  membersCanInvite: boolean;
}

export interface Participant {
  user?: User | string;
  _id?: string;
  fullname?: string;
  email?: string;
  avatar?: string;
  role?: "admin" | "member";
}

export interface ConversationParticipant extends User {
  role: "admin" | "member";
}

export interface ContactConnection {
  _id: string;
  connectionType: "friend" | "group";
  participants: Participant[];
  groupMetadata?: GroupMetadata;
}

export interface Message {
  _id: string;
  sender: string;
  conversationId: string;
  content: string;
  createdAt: string;
  status?: string;
}

export interface MessageDeletedEvent {
  messageId: string;
  conversationId: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupData extends Credentials {
  fullname: string;
}
