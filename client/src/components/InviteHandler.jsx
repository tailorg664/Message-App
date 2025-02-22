import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore.js";
import { toast } from "react-hot-toast";
function InviteHandler() {
  const { userId } = useParams();
  const { authUser, checkAuth } = useAuthStore();
  const {invitations} = useChatStore();
  const navigate = useNavigate();
  useEffect(() => {
    const handleInvitation = async (userId, authUser) => {
      const res = invitations(userId, authUser);
      console.log(res);
      
      if (res.success) {
        navigate("/message/");
      } else {
        toast.error("Invitation failed.", res.data.message);
      }
    };
    handleInvitation(userId, authUser);
    checkAuth();
  }, [checkAuth, authUser, userId, invitations, navigate]);
  return <div>Redirecting....</div>;
}

export default InviteHandler;
