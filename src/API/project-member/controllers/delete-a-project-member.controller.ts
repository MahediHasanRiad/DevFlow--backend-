import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ProjectMemberService } from "../service/project-member.service.js";

export const deleteAProjectMemberController = asyncHandler(async(req, res) => {
    const memberId = req.params.memberId as string
    if(!memberId) throw new ApiErrorHandler(404, 'Member id required !!!')

    const projectMemberService = new ProjectMemberService()
    await projectMemberService.deleteProjectMemberById(memberId)

    res.status(200).json(new apiResponse(null, 'Success'))
    
})