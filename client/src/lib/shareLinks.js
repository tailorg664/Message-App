const shareViaWhatsApp = (inviteLink) => {
  const url = `https://wa.me/?text=Join me on ChatApp: ${encodeURIComponent(
    inviteLink
  )}`;
  window.open(url, "_blank");
};

const shareViaTelegram = (inviteLink) => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(
    inviteLink
  )}&text=Join me on ChatApp!`;
  window.open(url, "_blank");
};

const shareViaEmail = (inviteLink) => {
  const subject = "Join me on ChatApp";
  const body = `Hey, join me on ChatApp using this link: ${inviteLink}`;
  const url = `mailto:?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.open(url, "_blank");
};

const shareViaFacebook = (inviteLink) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    inviteLink
  )}`;
  window.open(url, "_blank");
};

const shareViaTwitter = (inviteLink) => {
  const url = `https://twitter.com/intent/tweet?text=Join%20me%20on%20ChatApp!&url=${encodeURIComponent(
    inviteLink
  )}`;
  window.open(url, "_blank");
};

export {shareViaEmail, shareViaFacebook, shareViaTelegram, shareViaTwitter, shareViaWhatsApp};