import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { dailyTeamPlanController } from "../controller/daily-plan.controller.js";
import { dailyTeamPlanByMonthController } from "../controller/daily-plan-by-month.controller.js";

const dailyPlanRouter = Router();

dailyPlanRouter.get('/today-plan/:teamId/:date', authVerify, dailyTeamPlanController)
dailyPlanRouter.get('/daily-plan-by-month/:teamId/:month', authVerify, dailyTeamPlanByMonthController)


export default dailyPlanRouter;

