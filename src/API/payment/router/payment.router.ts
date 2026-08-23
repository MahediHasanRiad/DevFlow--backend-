import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { CreatePaymentCheckoutController } from "../controller/create-payment.controller.js";
import { SessionStatusController } from "../controller/session-status.controller.js";
import { AllPaymentHistoryController } from "../controller/all-payment-history.controller.js";
import { PaymentReleaseController } from "../controller/auto-release-payment.controller.js";
import { RestrictTo } from "../../../shared/restricet-to.js";

const paymentRouter = Router()

paymentRouter.get('/payment-session-status', authVerify, SessionStatusController)
paymentRouter.post('/create-payment-checkout', authVerify, CreatePaymentCheckoutController)
paymentRouter.post('/payment-release', authVerify, PaymentReleaseController)
paymentRouter.get('/all-payment-history',authVerify, RestrictTo('ADMIN', 'USER'), AllPaymentHistoryController)


export {paymentRouter}