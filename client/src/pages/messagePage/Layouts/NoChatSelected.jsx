import React from "react";
import { MessageSquare, X } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { generateInviteLink } from "../../../lib/invite";
import toast from "react-hot-toast";


function NoChatSelected() {
  const { authUser } = useAuthStore();
  const [showModal, setShowModal] = React.useState(false);
  const inviteLink = generateInviteLink(authUser?._id);
  const message = `Join me on ChatApp: ${inviteLink}`;
  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "./assets/inviteIcons/whatsapp.png",
      url: `https://wa.me/?text=${encodeURIComponent(message)}`,
    },
    {
      name: "Telegram",
      icon: "./assets/inviteIcons/telegram.png",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        inviteLink
      )}&text=${encodeURIComponent(message)}`,
    },
    {
      name: "Email",
      icon: "./assets/inviteIcons/gmail.png",
      url: `mailto:?subject=Join me on ChatApp&body=${encodeURIComponent(
        message
      )}`,
    },
    {
      name: "Facebook",
      icon: "./assets/inviteIcons/facebook.png",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        inviteLink
      )}`,
    },
    {
      name: "Twitter",
      icon: "./assets/inviteIcons/twitter.png",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`,
    },
  ];

  const handleInvitation = (platform) => {
    if (!authUser) {
      toast.error("You need to login to invite someone!");
      return;
    }
     const shareUrl =shareOptions.find((option) => option.name === platform).url
     window.open(shareUrl, "_blank");
  };
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="link-to-invitation" onClick={() => setShowModal(true)}>
          <div className="flex justify-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
          <div className="text-sm text-gray-400">Click to invite!</div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">
          Start chatting with your people!!
        </h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Share via</h3>
            <div className="flex justify-center gap-6">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleInvitation(option.name)}
                  className="focus:outline-none"
                >
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoChatSelected;
