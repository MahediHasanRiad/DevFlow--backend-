import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { saveDeviceTokenController } from "../controller/create-device-token.controller.js";

const notificationRouter = Router()


notificationRouter.post('/save', authVerify, saveDeviceTokenController)






export {notificationRouter}