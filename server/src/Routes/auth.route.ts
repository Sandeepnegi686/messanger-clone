import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";

import { login, signUp } from "../Controllers/auth.controller";
import authenticateUser from "../middleware/authenticateUser";
import { verifyCSRFToken } from "../middleware/csrfMiddleware";
import { generateToken } from "../config/generateToken";

dotenv.config({ quiet: true });

const CLIENT_URL = process.env.CLIENT_URL || "";

const router = express.Router();

router.post("/auth/signup", signUp);

router.post("/auth/login", login);

router.get(
  "/auth/me",
  authenticateUser,
  verifyCSRFToken,
  (req: Request, res: Response) => {
    return res.status(200).json({ success: true, user: req.user });
  },
);

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
      return res.redirect(`${CLIENT_URL}/auth-successfull`);
    } catch (error) {
      console.error(error);
      return res.redirect(`${CLIENT_URL}/login`);
    }
  },
);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${CLIENT_URL}`,
//     session: false,
//   }),
//   (req: Request, res: Response) => {
//     // Successful authentication, redirect home.
//     const user = req.user as any;
//     const data = { _id: user._id, name: user.name, email: user.email };
//     const token = jwt.sign(data, JWT_SECRET, {
//       expiresIn: 60 * 60 * 24, // 1 day
//     });
//     const url = `${CLIENT_URL}/auth-successfull?access-token=${token}`;
//     return res.redirect(url);
//   },
// );

export default router;
