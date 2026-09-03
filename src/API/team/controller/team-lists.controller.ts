import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationMemberService } from "../../organization-member/service/organization-member.service.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
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

  const user_Id = req.user?.id as string
  if(!user_Id) throw new ApiErrorHandler(401, 'Unathorized')

  const orgId = req.params.orgId as string
  if(!orgId) throw new ApiErrorHandler(404, "Organization not found")

  const teamService = new TeamService();
  const organizationService = new OrganizationService();
  const organizationMemberService = new OrganizationMemberService();

  // check organization exist
  const checkOrganizationExist = await organizationService.findOrganizationById(orgId)
  if (!checkOrganizationExist) throw new ApiErrorHandler(404, "Organization not found")

  // check member exist or not
  const checkMember = await organizationMemberService.findOrganizationMemberByUserId({
      userId: user_Id,
      organizationId: orgId,
    });
  if (!checkMember) throw new ApiErrorHandler(403, "You are not allowed to access this organization");

  // get from cash
  const cacheKey = `teams:${orgId}:`;
  const cacheValue = `${page}:${limit}:${sortBy}:${sortType}:${search}`
  const cachedTeamList = await redis.get(cacheKey + cacheValue);
  if (cachedTeamList) {
    res
      .status(200)
      .json(
        new apiResponse(JSON.parse(cachedTeamList), "Success from cache"),
      );
    return;
  }

  const teamList = await teamService.allTeamLists({
    page,
    limit,
    sortBy,
    sortType,
    ...(search !== undefined ? { search } : {}),
  });

  // set in redis
  await redis.hSet(cacheKey, cacheValue, JSON.stringify(teamList))
  await redis.expire(cacheKey, 300)

  res.status(200).json(new apiResponse(teamList, "Success"));
});
