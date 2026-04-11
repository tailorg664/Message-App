import Contact from "../model/ContactSchema.js";
import User from "../model/UserSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const addContact = asyncHandler(async (req, res) => {
  try {
    const { chatOrganizerId, userToInviteId } = req.body;
    const chatOrganizer = await User.findById(chatOrganizerId);
    console.log(chatOrganizer);

    if (!chatOrganizer) {
      throw new ApiError(404, "Chat Organizer not found");
    }

    const contact = new Contact({
      primaryUserId: chatOrganizerId,
      secondaryUserId: userToInviteId,
    });

    await contact.save();

    await User.findByIdAndUpdate(
      chatOrganizerId,
      {
        $push: { contacts: contact._id },
      },
      { new: true },
    );

    await User.findByIdAndUpdate(
      userToInviteId,
      {
        $push: { contacts: contact._id },
      },
      { new: true },
    );

    res.status(201).json(new ApiResponse(201, "Contact added", contact));
  } catch (error) {
    console.log(error);
  }
});

const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "invalid user entry");
  }

  const userContacts = await User.findById(userId).populate("contacts").lean();
  const contactInfo = [];

  for (const contact of userContacts.contacts) {
    const userInfo = async (contactUserId) => {
      return await User.findById(contactUserId)
        .select("fullname status avatar")
        .lean();
    };

    if (contact.primaryUserId.toString() !== userId.toString()) {
      contactInfo.push(await userInfo(contact.primaryUserId.toString()));
    } else if (contact.secondaryUserId.toString() !== userId.toString()) {
      contactInfo.push(await userInfo(contact.secondaryUserId.toString()));
    }
  }

  console.log(contactInfo);

  if (!userContacts) {
    throw new ApiError(404, "Contacts not found");
  }

  res.status(200).json(new ApiResponse(200, contactInfo, "Contacts retrieved"));
});

const updateContact = asyncHandler(async (req, res) => {});

export { addContact, getContacts, updateContact };
