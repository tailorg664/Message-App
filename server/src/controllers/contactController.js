import Conversation from "../model/ConversationSchema.js";
import User from "../model/UserSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";

const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url) {
    return null;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return null;
  }

  const assetPath = url.slice(uploadIndex + uploadMarker.length);
  const normalizedPath = assetPath.replace(/^v\d+\//, "");

  return normalizedPath.replace(/\.[^/.]+$/, "");
};

//add friend to the contact list of the user
const addFriend = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const friendEmail = req.body.email?.trim();
    const friend = await User.findOne({ email: friendEmail })
      .select("_id email")
      .lean();
    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }

    if (!friend) {
      throw new ApiError(
        404,
        "Friend does not exist. Please check the email and try again.",
      );
    }

    if (userId.toString() === friend._id.toString()) {
      throw new ApiError(400, "You cannot add yourself as a contact");
    }

    const existingFriend = await Conversation.findOne({
      connectionType: "friend",
      participants: { $size: 2 },
      $and: [
        { participants: { $elemMatch: { user: userId } } },
        { participants: { $elemMatch: { user: friend._id } } },
      ],
    }).lean();

    if (existingFriend) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Contact already exists"));
    }
    const connection = await Conversation.create({
      connectionType: "friend",
      participants: [{ user: userId }, { user: friend._id }],
    });
    await connection.save();

    return res
      .status(201)
      .json(new ApiResponse(201, connection, "Contact added"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message, [], error.stack);
  }
});
// create a friend group with a name, icon and multiple friends, and add authorization
const createFriendGroup = asyncHandler(async (req, res) => {
  try {
    //get the data from the request
    const userId = req.user._id;
    const { emails, groupName, groupIcon, groupDescription } = req.body;

    // get all friend ids from the emails provided and validate them
    const users = await User.find({ email: { $in: emails } })
      .select("_id email")
      .lean();
    const friendIds = users.map((user) => user._id);
    if (friendIds.includes(userId)) {
      throw new ApiError(400, "You cannot add yourself to the group");
    }
    // group icon functionality
    let uploadResult = null;
    if (groupIcon) {
      uploadResult = await cloudinary.uploader.upload(groupIcon);
    }
    // create the group conversation
    const createdGroupInstance = await Conversation.create({
      participants: [
        { user: userId, role: "admin" },
        ...friendIds.map((id) => ({ user: id, role: "member" })),
      ],
      connectionType: "group",
      groupMetadata: {
        name: groupName,
        icon: uploadResult?.secure_url,
        description: groupDescription,
        createdBy: userId,
      },
    });
    // save it to the database
    await createdGroupInstance.save();
    // send the response
    res
      .status(201)
      .json(new ApiResponse(201, createdGroupInstance, "Group created"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message, [], error.stack);
  }
});
// get all the connections of the user
const getConnections = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }

    const connections = await Conversation.find({
      "participants.user": userId,
    })
      .populate("participants.user", "fullname email avatar")
      .lean();
    const contactInfo = connections.map((connection) => {
      const participants =
        connection.connectionType === "group"
          ? connection.participants
          : connection.participants.filter(
              (participant) =>
                participant.user?._id?.toString() !== userId.toString(),
            );
      return {
        _id: connection._id,
        connectionType: connection.connectionType,
        participants,
        groupMetadata: connection.groupMetadata,
      };
    });

    res
      .status(200)
      .json(new ApiResponse(200, contactInfo, "Contacts retrieved"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message, [], error.stack);
  }
});
// delete a contact from the contact list of the user

const deleteContact = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;

    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }

    if (!contactId) {
      throw new ApiError(404, "invalid contact entry");
    }

    const connection = await Conversation.findOne({
      _id: contactId,
      "participants.user": userId,
    });

    if (!connection) {
      throw new ApiError(404, "Contact not found or already deleted");
    }

    if (connection.connectionType === "group") {
      const participantIndex = connection.participants.findIndex(
        (participant) => participant.user.toString() === userId.toString(),
      );

      if (participantIndex === -1) {
        throw new ApiError(403, "You are not a participant of this group");
      }

      const deletingParticipant = connection.participants[participantIndex];

      if (connection.participants.length === 1) {
        const oldIconPublicId = getCloudinaryPublicIdFromUrl(
          connection.groupMetadata?.icon,
        );
        if (oldIconPublicId) {
          await cloudinary.uploader.destroy(oldIconPublicId);
        }

        await Conversation.findByIdAndDelete(contactId);
        return res.status(200).json(new ApiResponse(200, null, "Chat deleted"));
      }

      if (deletingParticipant.role === "admin") {
        const otherAdmins = connection.participants.filter(
          (participant) =>
            participant.role === "admin" &&
            participant.user.toString() !== userId.toString(),
        );

        if (otherAdmins.length === 0) {
          const nextMember = connection.participants.find(
            (participant) => participant.user.toString() !== userId.toString(),
          );

          if (nextMember) {
            nextMember.role = "admin";
          }
        }
      }

      connection.participants.splice(participantIndex, 1);
      await connection.save();
      return res.status(200).json(new ApiResponse(200, null, "Chat deleted"));
    }

    await Conversation.findByIdAndDelete(contactId);
    res.status(200).json(new ApiResponse(200, null, "Contact deleted"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message, [], error.stack);
  }
});

const updateGroupMetaData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const { groupName, groupDescription } = req.body;
    const oldGroup = req.group;
    //validation for user and group entries
    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }
    //access control middleware added to check group existence and user participation
    const group = await Conversation.findByIdAndUpdate(
      groupId,
      {
        $set: {
          "groupMetadata.name": groupName,
          "groupMetadata.description": groupDescription,
        },
      },
      { new: true },
    ).lean();
    res.status(200).json(new ApiResponse(200, group, "Group info updated"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message, [], error.stack);
  }
});

const updateGroupIcon = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const { groupIcon } = req.body;
    const oldGroup = req.group;
    //validation for user and group entries
    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }
    // group icon functionality
    let uploadResult = null;
    if (groupIcon) {
      uploadResult = await cloudinary.uploader.upload(groupIcon);
    }

    const oldIconPublicId = getCloudinaryPublicIdFromUrl(
      oldGroup?.groupMetadata?.icon,
    );
    if (oldIconPublicId) {
      await cloudinary.uploader.destroy(oldIconPublicId);
    }

    const group = await Conversation.findByIdAndUpdate(
      groupId,
      {
        $set: {
          "groupMetadata.icon": uploadResult?.secure_url,
        },
      },
      { new: true },
    ).lean();
    res.status(200).json(new ApiResponse(200, group, "Group icon updated"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
});

const adminAccessControl = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const group = req.group;
    const { editAccess, inviteAccess } = req.body;
    // are you admin
    const isAdmin = group.participants.some(
      (participant) =>
        participant.user.toString() === userId.toString() &&
        participant.role === "admin",
    );
    if (!isAdmin) {
      throw new ApiError(403, "Access denied. Admins only.");
    }
    const updateAccess = await Conversation.findByIdAndUpdate(
      group._id,
      {
        $set: {
          "groupMetadata.settings.membersCanEditInfo": editAccess,
          "groupMetadata.settings.membersCanInvite": inviteAccess,
        },
      },
      { new: true },
    ).lean();
    res
      .status(200)
      .json(new ApiResponse(200, updateAccess, "Group settings updated"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
});

const exitGroup = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.groupId;

    const group = await Conversation.findById(groupId);
    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    if (group.connectionType !== "group") {
      throw new ApiError(400, "The specified contact is not a group");
    }

    const participantIndex = group.participants.findIndex(
      (participant) => participant.user.toString() === userId.toString(),
    );
    if (participantIndex === -1) {
      throw new ApiError(403, "You are not a participant of this group");
    }

    const exitingParticipant = group.participants[participantIndex];

    // If this is the last participant, remove the whole group to avoid orphaned records.
    if (group.participants.length === 1) {
      const oldIconPublicId = getCloudinaryPublicIdFromUrl(
        group.groupMetadata?.icon,
      );
      if (oldIconPublicId) {
        await cloudinary.uploader.destroy(oldIconPublicId);
      }

      await Conversation.findByIdAndDelete(groupId);
      return res.status(200).json(new ApiResponse(200, null, "Exited group"));
    }

    // When the last admin exits, promote another remaining participant before saving.
    if (exitingParticipant.role === "admin") {
      const otherAdmins = group.participants.filter(
        (participant) =>
          participant.role === "admin" &&
          participant.user.toString() !== userId.toString(),
      );

      if (otherAdmins.length === 0) {
        const nextMember = group.participants.find(
          (participant) => participant.user.toString() !== userId.toString(),
        );

        if (nextMember) {
          nextMember.role = "admin";
        }
      }
    }

    // Apply all participant changes in memory and persist them in a single save.
    group.participants.splice(participantIndex, 1);
    const updatedGroup = await group.save();

    res.status(200).json(new ApiResponse(200, updatedGroup, "Exited group"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
});

export {
  addFriend,
  createFriendGroup,
  getConnections,
  deleteContact,
  updateGroupMetaData,
  updateGroupIcon,
  adminAccessControl,
  exitGroup,
};
