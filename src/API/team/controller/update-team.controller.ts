import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UpdateTeamInputSchema, type UpdateTeamType } from "../schema/team.schema.js";
import { TeamService } from "../service/team.service.js";

export const UpdateTeamController = asyncHandler(async(req, res) => {
    
    const teamService = new TeamService()

    const teamId = req.params.teamId as string
    if(!teamId) throw new ApiErrorHandler(404, 'Team id required')

    const findTeam = await teamService.findATeamById(teamId)

    const { name, description } = UpdateTeamInputSchema.parse(req.body)


    const updatedData: { name?: string; description?: string } = {}
    if(name !== undefined) updatedData.name = name
    if(description !== undefined && description !== null) updatedData.description = description

    const id = findTeam?.id
    const team = await teamService.updateTeam({id, updatedData})  // update team

    res.status(200).json(new apiResponse(team, 'Successfully Updated !!!'))
})