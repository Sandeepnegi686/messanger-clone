import { login, signUp } from "../Controllers/auth.controller";
import express from "express";

const router = express.Router();

router.post("/auth/signup", signUp);

router.post("/auth/login", login);

export default router;
