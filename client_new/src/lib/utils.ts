import type {
  ContactConnection,
  ConversationParticipant,
  ConversationListItem,
  Participant,
  User,
} from "../types";

export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function normalizeParticipant(participant: Participant): User | null {
  if (participant.user && typeof participant.user === "object") {
    return participant.user;
  }

  if (participant._id && participant.fullname) {
    return {
      _id: participant._id,
      fullname: participant.fullname,
      email: "",
      avatar: participant.avatar,
    };
  }

  return null;
}

function getParticipantId(participant: Participant) {
  if (participant.user && typeof participant.user === "object") {
    return participant.user._id;
  }

  if (typeof participant.user === "string") {
    return participant.user;
  }

  return participant._id;
}

function getConversationParticipant(
  participant: Participant,
): ConversationParticipant | null {
  const user = normalizeParticipant(participant);

  if (!user) {
    return null;
  }

  return {
    ...user,
    role: participant.role || "member",
  };
}

export function getOtherParticipant(
  connection: ContactConnection,
  authUserId: string,
): User | null {
  const other = connection.participants.find((participant) => {
    if (participant.user && typeof participant.user === "object") {
      return participant.user._id !== authUserId;
    }

    return participant._id !== authUserId;
  });

  if (!other) {
    return null;
  }

  return normalizeParticipant(other);
}

export function getConversationListItem(
  connection: ContactConnection,
  authUserId: string,
): ConversationListItem | null {
  if (connection.connectionType === "group") {
    const participantIds = connection.participants
      .map(getParticipantId)
      .filter((participantId): participantId is string => Boolean(participantId));
    const participants = connection.participants
      .map(getConversationParticipant)
      .filter(
        (participant): participant is ConversationParticipant => Boolean(participant),
      );

    return {
      _id: connection._id,
      _conversationId: connection._id,
      connectionType: "group",
      fullname: connection.groupMetadata?.name || "Unnamed group",
      avatar: connection.groupMetadata?.icon || undefined,
      participantIds,
      participants,
      description: connection.groupMetadata?.description || null,
      settings: connection.groupMetadata?.settings,
    };
  }

  const user = getOtherParticipant(connection, authUserId);
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    _conversationId: connection._id,
    connectionType: "friend",
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
    participantIds: [user._id],
  };
}
