import { model, Schema } from "mongoose";

const schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
  text: { type: String },
  image: { type: String },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  deliveredTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

schema.index({ conversation: 1, createdAt: -1 });

const MessageModel = model("Message", schema);

export default MessageModel;
