import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateCSRFToken } from "../middleware/csrfMiddleware";
import client from "./redis.config";
import { APIError } from "../middleware/errorHandler";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

async function generateToken(id: string, res: Response) {
  const accessToken = jwt.sign({ _id: id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ _id: id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  client.set(`refreshToken:${id}`, refreshToken, {
    expiration: { type: "EX", value: 60 * 60 * 24 * 7 },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await generateCSRFToken(id, res);

  return { accessToken, refreshToken };
}

async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) throw new APIError("Refresh Token not present", 401);

  const decoded = await verifyRefreshToken(refreshToken);

  if (!decoded) {
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");
    return res
      .status(401)
      .json({ success: false, message: "Invalid Refresh Token" });
  }
  const accessToken = await generateAccesssToken((decoded as JwtPayload)._id);
  return res
    .status(200)
    .json({ success: true, message: "Access Token Generated", accessToken });
}

async function verifyRefreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const storedToken = await client.get(
      `refreshToken:${(decoded as JwtPayload)._id}`,
    );
    if (storedToken !== refreshToken) return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

async function generateAccesssToken(_id: string) {
  const accessToken = jwt.sign({ _id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
}

export { generateToken, refreshToken, verifyRefreshToken };
