import { asyncHandler } from "../../../shared/asyncHandler.js";
import { CreateProjectInputSchema } from "../schema/project.schema.js";
import { ProjectService } from "../service/project.service.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import redis from "../../../config/redis.js";

export const addNewProjectController = asyncHandler(async (req, res) => {

    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

    const orgId = req.user?.orgId as string
    if(!orgId) throw new ApiErrorHandler(401, 'Unauthorized')

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
  } = CreateProjectInputSchema.parse(req.body);

  const projectService = new ProjectService();

  // create
  const project = await projectService.AddNewProject({
    createdById: userId,
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
    teamId,
    organizationId: orgId
  });

  // clear cash
  await redis.del(`all-projects:`)
  await redis.del(`projects-by-team:${teamId}`)

  res.status(201).json(new apiResponse(project, 'Success'))
});
