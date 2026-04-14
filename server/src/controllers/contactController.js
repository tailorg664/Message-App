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
    const friendId = await User.findOne({ email: req.body.email })
      .select("_id")
      .lean();
    if (!userId) {
      throw new ApiError(404, "invalid user entry");
    }

    if (!friendId) {
      throw new ApiError(
        404,
        "Friend does not exist. Please check the email and try again.",
      );
    }

    if (userId === friendId) {
      throw new ApiError(400, "You cannot add yourself as a contact");
    }

    const existingFriend = await Conversation.findOne({
      connectionType: "friend",
      participants: { $all: [userId, friendId] },
    }).lean();

    if (existingFriend) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Contact already exists"));
    }
    const connection = await Conversation.create({
      connectionType: "friend",
      participants: [userId, friendId],
    });
    await connection.save();

    res.status(201).json(new ApiResponse(201, connection, "Contact added"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
});
// create a friend group with a name, icon and multiple friends, and add authorization 
const createFriendGroup = asyncHandler(async (req, res) => {
  try {
    //get the data from the request
    const userId = req.user._id;
    const { emails, groupName, groupIcon,groupDescription } = req.body;

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
      participants: [{user : userId, role: "admin"}, ...friendIds.map((id) => ({ user: id, role: "member" }))],
      connectionType: "group",
      groupMetadata: {
        name: groupName,
        icon: uploadResult?.secure_url,
        description: groupDescription,
        createdBy:userId
      },
    });
    // save it to the database
    await createdGroupInstance.save();
    // send the response
    res
      .status(201)
      .json(new ApiResponse(201, createdGroupInstance, "Group created"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
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
      participants: userId,
    })
      .populate("participants", "fullname avatar")
      .lean();
    const contactInfo = connections.map((connection) => {
      const otherParticipants = connection.participants.filter(
        (participant) => participant._id.toString() !== userId.toString(),
      );
      return {
        _id: connection._id,
        connectionType: connection.connectionType,
        participants: otherParticipants,
        groupMetadata: connection.groupMetadata,
      };
    });

    res
      .status(200)
      .json(new ApiResponse(200, contactInfo, "Contacts retrieved"));

  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
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

    const connection = await Conversation.findOneAndDelete({
      _id: contactId,
      participants: userId,
    }).lean();

    if (!connection) {
      throw new ApiError(404, "Contact not found or already deleted");
    }

    res.status(200).json(new ApiResponse(200, null, "Contact deleted"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
})

const updateGroupMetaData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const { groupName, groupDescription } = req.body;
    const oldGroup = req.group;
    //validation for user and group entries
    if(!userId){
      throw new ApiError(404, "invalid user entry");
    }
    //access control middleware added to check group existence and user participation
    const group = await Conversation.findByIdAndUpdate(
      groupId,
      {
        $set: {
          "groupMetadata.name": groupName,
          "groupMetadata.description": groupDescription
        },
      },
      { new: true },
    ).lean();
    res.status(200).json(new ApiResponse(200, group, "Group info updated"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
});

const updateGroupIcon = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const { groupIcon } = req.body;
    const oldGroup = req.group;
    //validation for user and group entries
    if(!userId){
      throw new ApiError(404, "invalid user entry");
    }
    // group icon functionality
    let uploadResult = null;
    if (groupIcon) {
      uploadResult = await cloudinary.uploader.upload(groupIcon);
    }

    const oldIconPublicId = getCloudinaryPublicIdFromUrl(oldGroup?.groupMetadata?.icon);
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

const adminAccessControl = asyncHandler(async(req, res) => {
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

export {
  addFriend,
  createFriendGroup,
  getConnections,
  deleteContact,
  updateGroupMetaData,
  updateGroupIcon,
  adminAccessControl
};
