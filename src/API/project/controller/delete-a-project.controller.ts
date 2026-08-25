import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import { apiResponse } from "../../../shared/apiResponseHandler.js"
import { asyncHandler } from "../../../shared/asyncHandler.js"
import { ProjectService } from "../service/project.service.js"


export const DeleteAProjectController = asyncHandler(async(req, res) => {
    const projectId = req.params.projectId as string
    if(!projectId) throw new ApiErrorHandler(404, 'Project id not found')

    const projectService = new ProjectService()
    await projectService.deleteAProjectById(projectId)

    res.status(200).json(new apiResponse(null, 'Success'))
})