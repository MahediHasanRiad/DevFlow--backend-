import { Router } from "express";


const conversationRouter = Router();

conversationRouter.post("/create", authVerify, createConversationController);

export { conversationRouter };
