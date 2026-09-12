import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createPaymentController } from "../controller/create-payment.controller.js";
import { webhookSessionController } from "../controller/webhook.controller.js";
import { cancelSubscriptionController } from "../controller/update-subscription-status.controller.js";

const paymentRouter = Router()


paymentRouter.post('/create-checkout-session', authVerify, createPaymentController)
paymentRouter.get('/webhook', authVerify, webhookSessionController)
paymentRouter.patch('/update-subscription-status', authVerify, cancelSubscriptionController)



export {paymentRouter}