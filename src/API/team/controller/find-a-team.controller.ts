import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../service/team.service.js";

export const FindATeamController = asyncHandler(async(req, res) => {
    const teamId = req.params.teamId as string
    if(!teamId) throw new ApiErrorHandler(404, 'Team id required !!!')

    const teamService = new TeamService()

    const team = await teamService.findATeamById(teamId)
    if(!team) throw new ApiErrorHandler(404, 'Team not found !!!')

    res.status(200).json(new apiResponse(team, 'Success'))
})