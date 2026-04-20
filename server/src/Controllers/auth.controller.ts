import { NextFunction, Request, Response } from "express";
import { loginValidation, validateRegister } from "../lib/validate";
import UserModel from "../Models/user.model";
import { generateToken } from "../config/generateToken";
import { APIError } from "../middleware/errorHandler";

async function signUp(
  req: Request<{}, {}, { name: string; email: string; password: string }, {}>,
  res: Response,
  next: NextFunction,
) {
  const { error } = validateRegister(req.body);
  if (error) throw new APIError(error?.details[0].message, 400);

  const { name, password, email } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new APIError("User already present", 400);

  const user = await UserModel.create({
    name,
    hashedPassword: password,
    email,
  });
  await generateToken(user._id.toString(), res);

  return res.status(201).json({
    success: true,
    message: "user created",
  });
}

//Login
async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) {
  const { error } = loginValidation(req.body);
  if (error) throw new APIError(error?.details[0]?.message, 400);

  const { email, password } = req?.body;
  const existingUser = await UserModel.findOne({ email }).select(
    "+hashedPassword",
  );
  if (!existingUser) throw new APIError("User not found", 400);

  const isValidPassword = await existingUser.comparePassword(password);

  if (!isValidPassword) throw new APIError("Password incorrect", 400);

  await generateToken(existingUser._id.toString(), res);

  return res.status(200).json({
    success: true,
    message: "Logged in",
  });
}

export { signUp, login };
