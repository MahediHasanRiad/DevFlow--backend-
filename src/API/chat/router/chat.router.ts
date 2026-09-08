import { Router } from "express";
import { createMessageController } from "../controller/chat.controller.js";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { upload } from "../../../middleware/multer.middleware.js";


const conversationRouter = Router();

conversationRouter.post("/create", authVerify, upload.single("attachment"), createMessageController);

export { conversationRouter };
