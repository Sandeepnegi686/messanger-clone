import { CookieOptions, NextFunction, Request, Response } from "express";
import { loginValidation, validateRegister } from "../lib/validate";
import UserModel from "../Models/user.model";
import { generateToken } from "../config/generateToken";

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
        .json({ success: false, message: error?.details[0].message });
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

    await generateToken(user._id.toString(), res);

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

  await generateToken(existingUser._id.toString(), res);

  return res.status(200).json({
    success: true,
    message: "Logged in",
  });
}

export { signUp, login };
