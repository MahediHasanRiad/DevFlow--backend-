import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../../team/service/team.service.js";
import type { QueryType } from "../../types/types.js";
import { ProjectService } from "../service/project.service.js";

export const allProjectsByTeamController = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "updatedAt",
    search,
  } = req.params as QueryType;
  page = Number(page);
  limit = Number(limit);

  const teamId = req.params.teamId as string;
  if (!teamId) throw new ApiErrorHandler(404, "teamId id not found");

  const teamService = new TeamService();
  const team = await teamService.findATeamById(teamId);
  if (!team) throw new ApiErrorHandler(404, "team not found !!!");

  const projectService = new ProjectService();
  const projectList = await projectService.allProjectListByTeam({
    page,
    limit,
    sortBy,
    sortType,
    ...(search !== undefined ? { search } : {}),
    teamId: team.id
  });

  res.status(200).json(new apiResponse(projectList, "Success"));
});
