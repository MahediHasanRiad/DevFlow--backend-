import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ProjectMemberService } from "../service/project-member.service.js";

export const findAProjectMemberController = asyncHandler(async(req, res) => {
    const memberId = req.params.memberId as string
    if(!memberId) throw new ApiErrorHandler(404, 'Member id required !!!')

    const projectMemberService = new ProjectMemberService()
    const projectMember = await projectMemberService.findProjectMemberById(memberId)
    if(!projectMember) throw new ApiErrorHandler(404, 'Project Member not found !')

    res.status(200).json(new apiResponse(projectMember, 'Success'))
    
})