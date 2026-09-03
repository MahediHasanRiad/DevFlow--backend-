import redis from "../../../config/redis.js";
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


  const cashKey = `projects-by-team:${teamId}`
  const cashValue = `${page}-${limit}-${sortBy}-${sortType}-${search}`

  const cachedData = await redis.hGetAll(`${cashKey}${cashValue}`)

  if(cachedData.data) {
    return res.status(200).json(new apiResponse(JSON.parse(cachedData.data), 'Success'))
  }

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
    teamId: team.id,
  });

  // cache in redis
  await redis.hSet(`${cashKey}${cashValue}`, {
    data: JSON.stringify(projectList),
  });

  res.status(200).json(new apiResponse(projectList, "Success"));
});
