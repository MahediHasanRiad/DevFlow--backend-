import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UpdateTeamMemberInputSchema } from "../schema/team-member.schema.js";
import { TeamMemberService } from "../service/team-member.service.js";

export const UpdateTeamMemberController = asyncHandler(async(req, res) => {

    const memberId = req.params.memberId as string
    if(!memberId) throw new ApiErrorHandler(404, 'Team member id required !')

    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

    const {teamId, responsibility} = UpdateTeamMemberInputSchema.parse(req.body)

    // verification
    const teamMemberService = new TeamMemberService()
    const teamLead = teamMemberService.CheckTeamLead({teamId, userId})
    if(!teamLead) throw new ApiErrorHandler(403, 'Only Team Lead can update !!!')

    // update
    const updateMember = await teamMemberService.updateTeamMember({id:memberId, responsibility})

    res.status(200).json(new apiResponse(updateMember, 'Successfully Updated !!!'))

})