import React from "react";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { generateInviteLink } from "../../../lib/invite";
import { shareViaEmail,shareViaFacebook,shareViaTelegram,shareViaTwitter,shareViaWhatsApp } from "../../../lib/shareLinks";
import toast from "react-hot-toast";
function NoChatSelected() {
  const { authUser } = useAuthStore();
  const handleInvitation = () => {
    if (!authUser) {
      toast.error("You need to login to invite someone!");
      return;
    }

    const inviteLink = generateInviteLink(authUser.id);
    const shareOptions = [
      {
        name: "WhatsApp",
        url: shareViaWhatsApp(inviteLink),
      },
      {
        name: "Telegram",
        url: shareViaTelegram(inviteLink),
      },
      {
        name: "Email",
        url: shareViaEmail(inviteLink),
      },
      {
        name: "Facebook",
        url: shareViaFacebook(inviteLink),
      },
      {
        name: "Twitter",
        url: shareViaTwitter(inviteLink),
      },
    ];

    // Create a prompt to let the user choose an option
    const selectedOption = prompt(
      "Share via:\n1. WhatsApp\n2. Telegram\n3. Email\n4. Facebook\n5. Twitter\n\nEnter the number:"
    );

    if (selectedOption && selectedOption >= 1 && selectedOption <= 5) {
      window.open(shareOptions[selectedOption - 1].url, "_blank");
    } else {
      alert("Invalid selection!");
    }
  };
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="link-to-invitation" onClick={handleInvitation}>
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
    </div>
  );
}

export default NoChatSelected;
