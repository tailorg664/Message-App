import mongoose from "mongoose";


const ConversationSchema = new mongoose.Schema(
  {
    // We let MongoDB handle the _id automatically

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Helpful for naming group chats; can be null for 1-on-1s
    groupMetadata: {
      name: { type: String,default : null },
      icon: { type: String, default: null },
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
export default Conversation;