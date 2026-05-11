import { NextFunction, Request, Response } from "express";
import { loginValidation, validateRegister } from "../lib/validate";
import UserModel from "../Models/user.model";
import { generateToken } from "../config/generateToken";
import { APIError } from "../middleware/errorHandler";
import client from "../config/redis.config";

async function getUsers(req: Request, res: Response, next: NextFunction) {
  const users = await UserModel.find({ _id: { $ne: (req.user as any)._id } });
  return res.status(200).json({ success: true, users });
}

export { getUsers };
