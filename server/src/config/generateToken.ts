import { Response } from "express";
import jwt from "jsonwebtoken";
import { generateCSRFToken } from "../middleware/csrfMiddleware";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

async function generateToken(id: string, res: Response) {
  const accessToken = jwt.sign({ _id: id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ _id: id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const csrfToken = await generateCSRFToken(id, res);

  return { accessToken, refreshToken };
}

export { generateToken };
