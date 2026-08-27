import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";

export const findADailyPlanRequestController = asyncHandler(async (req, res) => {

    const id = req.params.planRequestId as string
    if(!id) throw new ApiErrorHandler(404, 'Plan request id requied')

    const dailyPlanRequestService = new DailyPlanRequestService();
    const dailyPlanRequest = await dailyPlanRequestService.findADailyPlanRequest(id);
    if(!dailyPlanRequest) throw new ApiErrorHandler(404, 'Plan request not found');

    res.status(200).json(new apiResponse(dailyPlanRequest, 'Plan request found'));
    
})  