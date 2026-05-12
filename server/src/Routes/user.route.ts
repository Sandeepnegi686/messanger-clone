import express from "express";

import { getUsers } from "../Controllers/user.controller";

const router = express.Router();

router.get("/getUsers", getUsers);

export default router;
