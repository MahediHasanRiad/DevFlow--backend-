import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import {
  addParticipantController,
  createChatController,
  createMessageController,
} from "../controller/chat.controller.js";

const conversationRouter = Router();
const chatRouter = Router();

conversationRouter.post("/create", authVerify, createChatController);
conversationRouter.post(
  "/add-participant",
  authVerify,
  addParticipantController,
);

chatRouter.post("/send", authVerify, createMessageController);

export { conversationRouter, chatRouter };
