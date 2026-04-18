import type {
  ContactConnection,
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
      .map((participant) => {
        if (participant.user && typeof participant.user === "object") {
          return participant.user._id;
        }

        return participant._id;
      })
      .filter((participantId): participantId is string => Boolean(participantId));

    return {
      _id: connection._id,
      _conversationId: connection._id,
      connectionType: "group",
      fullname: connection.groupMetadata?.name || "Unnamed group",
      avatar: connection.groupMetadata?.icon || undefined,
      participantIds,
      description: connection.groupMetadata?.description || null,
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
