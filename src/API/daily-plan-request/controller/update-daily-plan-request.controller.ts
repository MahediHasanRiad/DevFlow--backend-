import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { updateDailyPlanRequestSchema } from "../schema/dailyPlanRequest.schema.js";
import redis from "../../../config/redis.js";

export const updateADailyPlanRequestController = asyncHandler(async(req, res) => {

    const id = req.params.planRequestId as string
    if(!id) throw new ApiErrorHandler(404, 'plan request id reqiured')

    const { task, note, status } = updateDailyPlanRequestSchema.parse(req.body)

    const dailyPlanService = new DailyPlanRequestService()
    const dailyPlan = await dailyPlanService.updateADailyPlanRequest(id, task, note, status)
    if(!dailyPlan) throw new ApiErrorHandler(404, 'Daily plan not found')

    // delete redis
    redis.del(`dailyPlanRequest:${dailyPlan.date}`)

    res.status(200).json(new apiResponse(dailyPlan, 'Daily plan updated successfully'))

})