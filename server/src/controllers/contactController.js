import Contact from "../model/ContactSchema.js";
import User from "../model/UserSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const addContact = asyncHandler(async (req, res) => {
  try {
    const { chatOrganizerId, userToInviteId } = req.body;
    const [chatOrganizer, userToInvite] = await Promise.all([
      User.findById(chatOrganizerId),
      User.findById(userToInviteId),
    ]);

    if (!chatOrganizer) {
      throw new ApiError(404, "Chat Organizer not found");
    }

    if (!userToInvite) {
      throw new ApiError(404, "User to invite not found");
    }

    if (chatOrganizerId === userToInviteId) {
      throw new ApiError(400, "You cannot add yourself as a contact");
    }

    const existingContact = await Contact.findOne({
      $or: [
        {
          primaryUserId: chatOrganizerId,
          secondaryUserId: userToInviteId,
        },
        {
          primaryUserId: userToInviteId,
          secondaryUserId: chatOrganizerId,
        },
      ],
    });

    if (existingContact) {
      throw new ApiError(409, "Contact already exists");
    }

    const contact = new Contact({
      primaryUserId: chatOrganizerId,
      secondaryUserId: userToInviteId,
    });

    await contact.save();

    res.status(201).json(new ApiResponse(201, contact, "Contact added"));
  } catch (error) {
    throw error;
  }
});

const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "invalid user entry");
  }

  const contacts = await Contact.find({
    $or: [{ primaryUserId: userId }, { secondaryUserId: userId }],
  }).lean();

  const contactUserIds = contacts.map((contact) =>
    contact.primaryUserId.toString() === userId.toString()
      ? contact.secondaryUserId.toString()
      : contact.primaryUserId.toString(),
  );

  const contactInfo = await User.find({
    _id: { $in: contactUserIds },
  })
    .select("fullname status avatar")
    .lean();

  res.status(200).json(new ApiResponse(200, contactInfo, "Contacts retrieved"));
});

const updateContact = asyncHandler(async (req, res) => {});

export { addContact, getContacts, updateContact };
