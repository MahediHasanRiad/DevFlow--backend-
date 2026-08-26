import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ProjectMemberService } from "../service/project-member.service.js";

export const ListOfProjectsByProjectController = asyncHandler(async(req, res) => {

    const projectId = req.params.projectId as string
    if(!projectId) throw new ApiErrorHandler(404, 'Project Id required')

    const projectMemberService = new ProjectMemberService()
    const projectMembers = projectMemberService.listOfAllMembersByProject(projectId)

    res.status(200).json(new apiResponse(projectMembers, 'Success'))

})