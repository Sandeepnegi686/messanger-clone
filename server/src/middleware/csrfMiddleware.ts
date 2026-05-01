import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import client from "../config/redis.config";

async function generateCSRFToken(userId: string, res: Response) {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const csrfKey = `csrf:${userId}`;
  await client.setEx(csrfKey, 3600, csrfToken);

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60,
  });

  return csrfToken;
}

async function verifyCSRFToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.method === "GET") {
      return next();
    }
    const userId = (req.user as any)._id;
    const csrfClientToken =
      req.headers["x-csrf-token"] ||
      req.headers["x-xsrf-token"] ||
      req.headers["csrf-token"];
    if (!csrfClientToken) {
      return res.status(403).json({
        success: false,
        message: "CSRF token missing. Please refresh the page.",
        code: "CSRF_TOKEN_MISSING",
      });
    }
    const csrfKey = `csrf:${userId}`;
    const storedToken = await client.get(csrfKey);
    if (!storedToken) {
      return res.status(403).json({
        success: false,
        message: "CSRF token expired. Please try again.",
        code: "CSRF_TOKEN_EXPIRED",
      });
    }
    if (csrfClientToken !== storedToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid CSRF token. Please refresh the page.",
        code: "CSRF_TOKEN_INVALID",
      });
    }
    console.log("CSRF verified");
    next();
  } catch (error) {
    console.log(error);
    console.log("CSRF_VERIFICATION_ERROR");
    return res.status(403).json({
      success: false,
      mussage:
        error instanceof Error
          ? error.message
          : "Something went wrong on server side.",
    });
  }
}

async function revokecsrfToken(userId: string) {
  const csrfKey = `csrf:${userId}`;
  await client.del(csrfKey);
}

async function refreshCSRFToken(req: Request, res: Response) {
  await revokecsrfToken((req.user as any)._id);
  await generateCSRFToken((req.user as any)._id, res);
  return res
    .status(200)
    .json({ success: true, message: "CSRF Token refreshed" });
}

export {
  generateCSRFToken,
  verifyCSRFToken,
  revokecsrfToken,
  refreshCSRFToken,
};
