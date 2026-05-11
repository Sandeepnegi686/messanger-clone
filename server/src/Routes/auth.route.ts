import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";

import { login, logout, signUp } from "../Controllers/auth.controller";
import authenticateUser from "../middleware/authenticateUser";
// import {
//   generateCSRFToken,
//   refreshCSRFToken,
//   revokecsrfToken,
//   verifyCSRFToken,
// } from "../middleware/csrfMiddleware";
import {
  generateToken,
  refreshToken,
  verifyRefreshToken,
} from "../config/generateToken";

dotenv.config({ quiet: true });

const CLIENT_URL = process.env.CLIENT_URL || "";

const router = express.Router();

router.post("/auth/signup", signUp);

router.post("/auth/login", login);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: CLIENT_URL,
    session: false,
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      await generateToken(user._id.toString(), res);
      return res.redirect(`${CLIENT_URL}/users`);
    } catch (error) {
      console.error(error);
      return res.redirect(CLIENT_URL);
    }
  },
);

router.get(
  "/auth/me",
  authenticateUser,
  // verifyCSRFToken,
  (req: Request, res: Response) => {
    return res.status(200).json({ success: true, user: req.user });
  },
);

router.post("/auth/refresh-token", refreshToken);

// router.get("/auth/verify-refresh-token", (req: Request, res: Response) => {
//   const refreshToken = req.body.refreshToken;
//   const token = verifyRefreshToken;
// });

router.post("/auth/logout", authenticateUser, logout);

// router.get("/get-new-csrf-token", authenticateUser, refreshCSRFToken);

export default router;
