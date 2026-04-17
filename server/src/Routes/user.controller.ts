import { CookieOptions, NextFunction, Request, Response } from "express";
import { loginValidation, validateRegister } from "../lib/validate";
import UserModel from "../Models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

const cookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

async function signUp(
  req: Request<{}, {}, { name: string; email: string; password: string }, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { error } = validateRegister(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const { name, password, email } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already present" });
    }

    const user = await UserModel.create({
      name,
      password,
      email,
    });

    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(data, JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.cookie("access-token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "user created",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//Login
async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) {
  const { error } = loginValidation(req.body);

  if (error) {
    const errMsg = error?.details[0]?.message;
    return res.status(400).json({ success: false, message: errMsg });
  }
  const { email, password } = req?.body;
  // console.log(email, password);

  const existingUser = await UserModel.findOne({ email }).select(
    "+hashedPassword",
  );
  if (!existingUser) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isValidPassword = await existingUser.comparePassword(password);

  if (!isValidPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password incorrect" });
  }

  const userObject = existingUser.toObject();
  const { hashedPassword: pass, ...user } = userObject;

  const data = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
  };

  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

  res.cookie("access-token", token, cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged in",
    user,
  });
}

export { signUp, login };
