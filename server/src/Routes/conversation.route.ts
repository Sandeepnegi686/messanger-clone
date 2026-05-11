import express from "express";
import {
  createConversation,
  getConversations,
} from "../Controllers/conservation.controller";

const router = express.Router();

router.post("/createConversation", createConversation);

router.get("/getConversations", getConversations);

export default router;
