import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import client from "../config/redis.config";
import UserModel, { UserType } from "../Models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "";

type AuthTokenPayload = JwtPayload & {
  _id: string;
};

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    // console.log(token)
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded._id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const payload = decoded as AuthTokenPayload;

    // 🔥 Redis Cache
    const cachedUser = await client.get(`user:${payload._id}`);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser) as UserType;
      return next();
    }

    const user = await UserModel.findById(payload._id).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    await client.set(`user:${payload._id}`, JSON.stringify(user), {
      expiration: { type: "EX", value: 60 * 60 },
    });

    req.user = user as UserType;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

export default authenticateUser;
