import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ProjectService } from "../service/project.service.js";

export const FindAProjectController = asyncHandler(async(req, res) => {
    const projectId = req.params.projectId as string
    if(!projectId) throw new ApiErrorHandler(404, 'Project id not found')

    const projectService = new ProjectService()
    const project = await projectService.findAProjectById(projectId)
    if(!project) throw new ApiErrorHandler(404, 'Project not found')

    res.status(200).json(new apiResponse(project, 'Success'))
})