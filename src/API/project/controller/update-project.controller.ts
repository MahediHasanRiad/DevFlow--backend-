import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UpdateProjectInputSchema, type UpdateProjectInputType } from "../schema/project.schema.js";
import { ProjectService } from "../service/project.service.js";

export const UpdateProjectController = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  if (!projectId) throw new ApiErrorHandler(404, "Project id required");

  const projectService = new ProjectService()
  const project = await projectService.findAProjectById(projectId)
  if(!project) throw new ApiErrorHandler(404, 'Project Not found')

  const {
    name,
    description,
    status,
    progress,
    startDate,
    deadline,
    totalMileStone,
    completedMileStone,
    amount,
    receivedAmount,
    teamId
  } = UpdateProjectInputSchema.parse(req.body);

  const updatedData:UpdateProjectInputType = {}

  if(name !== undefined) updatedData.name = name ?? project.name 
  if(description !== undefined) updatedData.description = description ?? project.description
  if(status !== undefined) updatedData.status = status ?? project.status
  if(progress !== undefined) updatedData.progress = progress ?? project.progress
  if(startDate !== undefined) updatedData.startDate = startDate ?? project.startDate
  if(deadline !== undefined) updatedData.deadline = deadline ?? project.deadline
  if(totalMileStone !== undefined) updatedData.totalMileStone = totalMileStone ?? project.totalMileStone
  if(completedMileStone !== undefined) updatedData.completedMileStone = completedMileStone ?? project.completedMileStone
  if(amount !== undefined) updatedData.amount = amount ?? project.amount
  if(receivedAmount !== undefined) updatedData.receivedAmount = receivedAmount ?? project.receivedAmount
  if(teamId !== undefined) updatedData.teamId = teamId ?? project.teamId


  // update
  const id = project?.id as string
  const update = await projectService.UpdateProject({ id, updatedData })


  res.status(200).json(new apiResponse(update, 'Success'))

});
