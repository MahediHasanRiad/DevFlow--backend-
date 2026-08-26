import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { updateProjectMemberSchema } from "../schema/projectMember.schema.js";
import { ProjectMemberService } from "../service/project-member.service.js";

export const updateProjectMemberController = asyncHandler(async(req, res) => {
    
    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized !!!')

    const memberId = req.params.memberId as string
    if(!memberId) throw new ApiErrorHandler(404, 'Member id required')

    const projectMemberService = new ProjectMemberService()

    const member = await projectMemberService.findProjectMemberById(memberId)
    if(!member) throw new ApiErrorHandler(404, 'Project Member not found')

    const {responsibility} = updateProjectMemberSchema.parse(req.body) // schema
    if(!responsibility) throw new ApiErrorHandler(400, 'Responsibility required')

    // verify
    const isTeamLead = await projectMemberService.isTeamLead({projectId:member.projectId, userId})
    if(!isTeamLead) throw new ApiErrorHandler(403, 'Only Team Lead can update !')

    // update
    // const existTeamLead = await projectMemberService.findTeamLeadByProject(member.projectId)
    // if(!existTeamLead) throw new ApiErrorHandler(400, 'Team lead does not exist')

    const projectMember = await projectMemberService.updateProjectMember({id:memberId, responsibility})

    res.status(200).json(new apiResponse(projectMember, 'Update Successfully !!!'))

})