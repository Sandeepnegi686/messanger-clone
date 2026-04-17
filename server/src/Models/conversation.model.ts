import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      // Only for Group chats
      type: String,
    },
    isGroup: {
      //Only for Groups Chats
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        // Only for Group Chats
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

schema.index({ participants: 1 });

const ConversationModel = model("Conversation", schema);

export default ConversationModel;
