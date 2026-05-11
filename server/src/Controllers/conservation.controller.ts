import { NextFunction, Request, Response } from "express";
import { loginValidation, validateRegister } from "../lib/validate";
import ConservationModel from "../Models/conversation.model";
import { generateToken } from "../config/generateToken";
import { APIError } from "../middleware/errorHandler";
import client from "../config/redis.config";
import ConversationModel from "../Models/conversation.model";

async function createConservation(
  req: Request<
    {},
    {},
    { name: string; isGroup: boolean; participants: string[] }
  >,
  res: Response,
  next: NextFunction,
) {
  const { name, isGroup, participants } = req.body;
  const currentUserId = (req.user as any)._id;

  //Group chats
  if (isGroup) {
    if (isGroup && (!participants || participants.length < 2 || !name)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    const newConservation = await ConservationModel.create({
      name,
      isGroup: true,
      participants: [...participants, currentUserId],
      admins: [currentUserId],
    });
    return res.status(201).json({
      success: true,
      newConservation,
      message: "Conversation Created",
    });
  }

  //Direct Chats
  if (!participants || participants.length !== 1) {
    return res
      .status(400)
      .json({ success: false, message: "Direct chat requires 2 participants" });
  }
  const otherUserId = participants[0];

  // Prevent chatting with yourself
  if (otherUserId === String(currentUserId)) {
    return res.status(400).json({
      success: false,
      message: "You cannot create chat with yourself",
    });
  }

  // Check if conversation already exists
  const existingConversation = await ConversationModel.findOne({
    isGroup: false,
    participants: {
      $all: [currentUserId, otherUserId],
    },
    $expr: {
      $eq: [{ $size: "$participants" }, 2],
    },
  });
  if (existingConversation) {
    return res.status(200).json({
      success: true,
      conversation: existingConversation,
    });
  }

  // Create new direct conversation
  const newConversation = await ConversationModel.create({
    isGroup: false,
    participants: [currentUserId, otherUserId],
  });

  return res.status(201).json({
    success: true,
    conversation: newConversation,
    message: "Conversation created",
  });
}

export { createConservation };
