import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import type { QueryType } from "../../types/types.js";
import { TeamService } from "../service/team.service.js";

export const TeamListController = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "updatedAt",
    search,
  } = req.params as QueryType;
  page = Number(page);
  limit = Number(limit);

  const teamService = new TeamService();

  const teamList = await teamService.allTeamLists({
    page,
    limit,
    sortBy,
    sortType,
    ...(search !== undefined ? { search } : {}),
  });

  res.status(200).json(new apiResponse(teamList, "Success"));
});
