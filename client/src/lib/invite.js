export const generateInviteLink = (userId) => {
  return `${window.location.origin}/invite/${userId}`;
};
