import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],

    // Helpful for naming group chats; can be null for 1-on-1s
    groupMetadata: {
      name: { type: String, default: null },
      icon: { type: String, default: null },
      description: { type: String, default: null },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      settings: {
        membersCanEditInfo: { type: Boolean, default: false }, // Default: Only Admins can edit
        membersCanInvite: { type: Boolean, default: true },
      },
    },
    // Useful for the "Chat List" sorting
    connectionType: {
      type: String,
      enum: ["friend", "group"],
      required: true,
    },
  },
  { timestamps: true },
);

// Indexing participants is crucial for fast lookups
ConversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", ConversationSchema);

// Todo : chat deletion middleware.
export default Conversation;
