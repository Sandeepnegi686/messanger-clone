import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dc0qhdk9n/image/upload/v1776410333/avatar_1_mqespm.png",
    },
    hashedPassword: {
      type: String,
    },
  },
  { timestamps: true },
);

const UserModel = model("User", schema);

export default UserModel;
