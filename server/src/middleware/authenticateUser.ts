import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import client from "../config/redis.config";
import UserModel, { UserType } from "../Models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

type AuthTokenPayload = JwtPayload & {
  _id: string;
};

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req?.cookies?.["accessToken"];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication Header not present.",
      });
    }
    const token = authHeader;
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    const cachedUser = await client.get(`user:${payload._id}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser) as UserType;
      return next();
    }
    const user = await UserModel.findById(payload._id).lean();
    await client.set(`user:${payload._id}`, JSON.stringify(user), {
      expiration: { type: "EX", value: 60 * 60 },
    });
    req.user = user ? (user as UserType) : undefined;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "unauthorized" });
  }
}

export default authenticateUser;
