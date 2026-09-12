import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createSubscriptionController } from "../controller/create-subscription.controller.js";
import { findSingleSubscription } from "../controller/find-subscription.controller.js";
import { findAllSubscriptionController } from "../controller/find-all-subscription.controller.js";
import { deleteSubscriptionController } from "../controller/delete-subscription.controller.js";
import { updateSubscriptionPlanController } from "../controller/update-subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/create", authVerify, createSubscriptionController);
subscriptionRouter.get(
  "/find-subscriptions/:subscriptionId",
  authVerify,
  findSingleSubscription,
);
subscriptionRouter.patch('/update/:subscriptionPlanId', authVerify, updateSubscriptionPlanController)
subscriptionRouter.delete('/delete/:subscriptionPlanId', authVerify, deleteSubscriptionController)
subscriptionRouter.get('/find-all-subscriptions', authVerify, findAllSubscriptionController)

export { subscriptionRouter };
