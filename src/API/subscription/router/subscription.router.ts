import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createSubscriptionController } from "../controller/create-subscription.controller.js";


const subscriptionRouter = Router();

subscriptionRouter.post("/create", authVerify, createSubscriptionController);

export { subscriptionRouter };