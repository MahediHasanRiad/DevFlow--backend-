import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { DailyPlanService } from "../service/team-plan.service.js";

export const dailyTeamPlanByMonthController = asyncHandler(async(req, res) => {
    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

    const {teamId} = req.params as {teamId: string}
    const {month} = req.params as {month: string}

    const monthNum = parseInt(month, 10);
    if(isNaN(monthNum) || monthNum < 1 || monthNum > 12) throw new ApiErrorHandler(400, 'Invalid month')
    
    const dailyPlanByMonth = new DailyPlanService()
    const response = await dailyPlanByMonth.dailyPlanByMonth(teamId, monthNum);

    res.status(200).json(new apiResponse(response, 'Success'))  
      
    
}) 