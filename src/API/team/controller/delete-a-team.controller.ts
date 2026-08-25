import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../service/team.service.js";

export const DeleteATeamController = asyncHandler(async (req, res) => {
  const teamId = req.params.teamId as string;
  if (!teamId) throw new ApiErrorHandler(404, "Team id required !!!");

  const teamService = new TeamService();

  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  const team = await teamService.findATeamById(teamId);
  if (!team) throw new ApiErrorHandler(404, "Team not found !!!");

  // verification
  if (userId !== team.createdById)
    throw new ApiErrorHandler(403, "Does not have Delete Permission !!!");

  // delete
  const t = await teamService.deleteATeamById(teamId);
  if (!t) throw new ApiErrorHandler(404, "Team not found !!!");

  res.status(204).json(new apiResponse(null, "Success"));
});
