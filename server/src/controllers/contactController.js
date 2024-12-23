const Contact = require('../model/ContactSchema');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

exports.getContacts = asyncHandler(async (req, res) => {
      const {userId} = req.body;
      if (!userId) {
            throw new ApiError(400, 'userId is required');
      }
      const contacts = await Contact.find({ userId });
      res.json(new ApiResponse(200, 'Contacts retrieved', contacts));
})
exports.addContact = asyncHandler(async (req, res) => {
      const { userId, contactId } = req.body;
      if (!userId || !contactId) {
            throw new ApiError(400, 'userId and contactId is required');
      }
      const contact = new Contact({
            userId,
            contactId,
      });
      const response = await contact.save();
      console.log(response);
      
      res.status(201).json(new ApiResponse(201, 'Contact added', contact));
})