import argon2 from "argon2";
import { Model, model, Schema } from "mongoose";
import validator from "validator";

interface UserType {
  name: string;
  email: string;
  emailVerified?: boolean;
  hashedPassword?: string;
  image?: string;
  publicImageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(userPassword: string): Promise<boolean>;
}

type UserModelType = Model<UserType, {}, IUserMethods>;

const schema = new Schema<UserType, UserModelType, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
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
    publicImageId: {
      type: String,
    },
    hashedPassword: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

schema.pre("save", async function () {
  try {
    if (this.isModified("hashedPassword")) {
      this.hashedPassword = await argon2.hash(this.hashedPassword!);
    }
  } catch (error) {
    console.log("Something went wrong while saving the hashed password");
    console.log(error);
  }
});

schema.methods.comparePassword = async function (userPassword: string) {
  try {
    if (await argon2.verify(this.hashedPassword!, userPassword)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    console.log("Something went wrong while comparing the password");
    return false;
  }
};

const UserModel = model<UserType, UserModelType>("User", schema);

export default UserModel;
