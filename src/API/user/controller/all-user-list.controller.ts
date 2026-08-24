import { prisma } from "../../../lib/prisma.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import type { QueryType } from "../../types/types.js";
import { UserService } from "../service/user.service.js";

export const allUserListByTeamController = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = 'updatedAt',
    search,
  } = req.params as QueryType;
  page = Number(page)
  limit = Number(limit)

  const userService = new UserService()

  // team member by team
  const teamMembers = await userService.userListByTeam({
    page,
    limit,
    sortBy,
    sortType,
    ...(search !== undefined ? { search } : {}),
  })


  res.status(200).json(new apiResponse(teamMembers, "success"));
});
