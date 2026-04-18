export const generateInviteLink = (email: string) => {
  return `${window.location.origin}/invite/${encodeURIComponent(email)}`;
};
