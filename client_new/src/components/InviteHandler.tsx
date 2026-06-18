import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

function InviteHandler() {
  const { inviteValue } = useParams<{ inviteValue: string }>();
  const { addFriendByEmail, getUsers } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      if (!inviteValue) {
        toast.error("Invalid invite link");
        navigate("/");
        return;
      }

      const decodedEmail = decodeURIComponent(inviteValue).trim();
      const success = await addFriendByEmail(decodedEmail);

      if (success) {
        await getUsers();
        navigate("/");
        return;
      }

      navigate("/");
    };

    void handleInvitation();
  }, [addFriendByEmail, getUsers, inviteValue, navigate]);

  return <div className="pt-24 text-center">Processing invite...</div>;
}

export default InviteHandler;
