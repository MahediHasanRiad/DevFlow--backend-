import { asyncHandler } from "../../../shared/asyncHandler.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import redis from "../../../config/redis.js";

export const getAllDailyPlanRequestByDateController = asyncHandler(async (req, res) => {
    const date = req.params.date as string
    if (!date) throw new ApiErrorHandler(400, 'Date is required')

    // get from redis
    const data = await redis.get(`dailyPlanRequest:${date}`)
    if (data) {
        res.status(200).json(new apiResponse(JSON.parse(data), 'Daily plan request found successfully'));
        return;
    }

    const dailyPlanRequestService = new DailyPlanRequestService()
    const dailyPlanRequest = await dailyPlanRequestService.getDailyPlanRequestByDate(date)

    // set redis
    await redis.setEx(`dailyPlanRequest:${date}`, 300, JSON.stringify(dailyPlanRequest))

    res.status(200).json(new apiResponse(dailyPlanRequest, 'Daily plan request found successfully'))

})
