import Conversation from "../model/ConversationSchema.js";
import User from "../model/UserSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";
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
const createFriendGroup = asyncHandler(async (req,res)=>{
  try {
    //get the data from the request
    const userId = req.user._id;
    const { emails, groupName,groupIcon } = req.body;

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
    if(groupIcon){
      uploadResult = await cloudinary.uploader.upload(groupIcon);
    }
    // create the group conversation
    const createdGroupInstance = await Conversation.create({
      participants: [userId, ...friendIds],
      connectionType: "group",
      groupMetadata: {
        name: groupName,
        icon: uploadResult?.secure_url,
      },
    });
    // save it to the database
    await createdGroupInstance.save();
    // send the response
    res.status(201).json(new ApiResponse(201, createdGroupInstance, "Group created"));
  } catch (error) {
    throw new ApiError({ message: error.message, stack: error.stack });
  }
})
const getConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "invalid user entry");
  }

  const connections = await Conversation.find({
    participants: userId,
  }).populate("participants" , "fullname status avatar").lean();
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
  

  res.status(200).json(new ApiResponse(200, contactInfo, "Contacts retrieved"));
});

const updateContact = asyncHandler(async (req, res) => {});

export { addFriend,createFriendGroup, getConnections };
// export { addContact, getContacts, updateContact };
