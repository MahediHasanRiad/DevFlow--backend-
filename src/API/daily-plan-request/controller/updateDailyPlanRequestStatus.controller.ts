import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";
import { updateDailyPlanRequestStatusSchema } from "../schema/dailyPlanRequest.schema.js";
import redis from "../../../config/redis.js";

export const updateDailyPlanRequestStatusController = asyncHandler(async(req, res) => {

    const id = req.params.planRequestId as string
    if(!id) throw new ApiErrorHandler(404, 'plan request id required')

    const { status } = updateDailyPlanRequestStatusSchema.parse(req.body)
    
    const dailyPlanService = new DailyPlanRequestService()
    const dailyPlan = await dailyPlanService.updateDailyPlanRequestStatus(id, status)
    if(!dailyPlan) throw new ApiErrorHandler(404, 'Daily plan not found')

    // delete redis cache
    const dateKey = dailyPlan.date instanceof Date ? dailyPlan.date.toISOString().split('T')[0] : String(dailyPlan.date).split('T')[0];
    await redis.del(`dailyPlanRequest:${dateKey}`);

    res.status(200).json(new apiResponse(dailyPlan, 'Daily plan status updated successfully'))   
})
