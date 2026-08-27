import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createDailyPlanRequestController } from "../controller/create-daily-plan-request.controller.js";

const dailyPlanRequestRouter = Router()

dailyPlanRequestRouter.post('/create', authVerify, createDailyPlanRequestController)



export { dailyPlanRequestRouter }