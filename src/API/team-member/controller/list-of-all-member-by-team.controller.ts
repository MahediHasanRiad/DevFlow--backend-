import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../../team/service/team.service.js";
import { TeamMemberService } from "../service/team-member.service.js";

export const listOfAllMemberByTeamController = asyncHandler(async(req, res) => {
    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

    const teamId = req.params.teamId as string
    if(!teamId) throw new ApiErrorHandler(404, 'Team id required !!!')

    const teamMemberService = new TeamMemberService()
    const teamService = new TeamService()
    
    const team = teamService.findATeamById(teamId)
    if(!team) throw new ApiErrorHandler(404, 'Team not found')

    const members = await teamMemberService.listOfMembersByTeam((await team).id)

    res.status(200).json(new apiResponse(members, 'Success'))
})