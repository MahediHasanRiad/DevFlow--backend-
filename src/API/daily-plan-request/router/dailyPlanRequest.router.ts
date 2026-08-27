import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createDailyPlanRequestController } from "../controller/create-daily-plan-request.controller.js";
import { findADailyPlanRequestController } from "../controller/find-a-daily-plan-request.controller.js";
import { deleteADailyPlanRequestController } from "../controller/delete-daily-plan-request.controller.js";
import { updateADailyPlanRequestController } from "../controller/update-daily-plan-request.controller.js";
import { getAllDailyPlanRequestByDateController } from "../controller/list-of-daily-plan-request-by-date.controller.js";
import { updateDailyPlanRequestStatusController } from "../controller/updateDailyPlanRequestStatus.controller.js";

const dailyPlanRequestRouter = Router()

dailyPlanRequestRouter.post('/create', authVerify, createDailyPlanRequestController)
dailyPlanRequestRouter.get('/:planRequestId', authVerify, findADailyPlanRequestController)
dailyPlanRequestRouter.delete('/:planRequestId', authVerify, deleteADailyPlanRequestController)
dailyPlanRequestRouter.patch('/update/:planRequestId', authVerify, updateADailyPlanRequestController)
dailyPlanRequestRouter.patch('/update-status/:planRequestId', authVerify, updateDailyPlanRequestStatusController)
dailyPlanRequestRouter.get('/all-daily-plan-request-by-date/:date', authVerify, getAllDailyPlanRequestByDateController)



export { dailyPlanRequestRouter }