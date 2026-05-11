import express from "express";

import { getUsers } from "../Controllers/user.controller";

// const CLIENT_URL = process.env.CLIENT_URL || "";

const router = express.Router();

router.get("/getUsers", getUsers);

export default router;
