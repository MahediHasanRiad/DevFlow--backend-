import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../../team/service/team.service.js";
import { UserService } from "../../user/service/user.service.js";
import { CreateTeamMemberInputSchema } from "../schema/team-member.schema.js";
import { TeamMemberService } from "../service/team-member.service.js";

export const addTeamMemberController = asyncHandler(async(req, res) => {

    const {teamId, userId, responsibility} = CreateTeamMemberInputSchema.parse(req.body)

    const teamService = new TeamService()
    const userService = new UserService()
    const teamMemberService = new TeamMemberService()

    const findTeam = await teamService.findATeamById(teamId)
    if(!findTeam) throw new ApiErrorHandler(404, 'team not found !!!')

    const findUser = await userService.findUserById(userId)
    if(!findUser) throw new ApiErrorHandler(404, 'user not found !!!')

    // create
    const addNewMember = await teamMemberService.addNewTeamMember({teamId, userId, responsibility})

    res.status(201).json(new apiResponse({member:addNewMember}, 'Successfully added a new member'))

})