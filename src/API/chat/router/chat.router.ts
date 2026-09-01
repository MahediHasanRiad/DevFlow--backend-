import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createChatController } from "../controller/chat.controller.js";

const chatRouter = Router();

chatRouter.post('/create', authVerify, createChatController)

export {chatRouter}