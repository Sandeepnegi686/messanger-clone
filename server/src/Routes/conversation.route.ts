import express from "express";
import { createConservation } from "../Controllers/conservation.controller";

const router = express.Router();

router.post("/createConversation", createConservation);

export default router;
