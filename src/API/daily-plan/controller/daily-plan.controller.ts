import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../../team/service/team.service.js";
import { DailyPlanService } from "../service/team-plan.service.js";


export const dailyTeamPlanController = asyncHandler(async (req, res) => {
    const date = req.params.date as string
    if (!date) throw new ApiErrorHandler(404, 'Date required')

    const userId = req.user?.id;
    if (!userId) throw new ApiErrorHandler(401, 'Unauthorized');

    const teamId = req.params.teamId as string
    if (!teamId) throw new ApiErrorHandler(404, 'Team id required')

    const dailyPlanService = new DailyPlanService()
    const teamService = new TeamService()

    // find team
    const team = await teamService.findATeamById(teamId)
    if(!team) throw new ApiErrorHandler(404, 'Team not found')


    const response = await dailyPlanService.dailyPlan(date, team.id)
    if(response.length === 0) throw new ApiErrorHandler(404, 'No daily plan found for this date')
    

    res.status(200).json(new apiResponse(response, 'Successfull'))  
})