import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import type { QueryType } from "../../types/types.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const getListOfAllMemberController = asyncHandler(async (req, res) => {
  let {
    limit = 10,
    page = 1,
    sortBy = "desc",
    sortType = "createdAt",
    search = "",
  } = req.query as QueryType;
  page = Number(page);
  limit = Number(limit);

  const orgId = req.params.orgId as string;
  if (!orgId) throw new ApiErrorHandler(404, "Organization Id required !");

  const organizationMemberService = new OrganizationMemberService();
  const organizationService = new OrganizationService();

  const findOrganization =
    await organizationService.findOrganizationById(orgId);
  if (!findOrganization)
    throw new ApiErrorHandler(404, "Organization not found !");

  // get from cash
  const cacheKey = `organization-member:`;
  const cacheField = `${orgId}:page:${page}:limit:${limit}:sortBy:${sortBy}:sortType:${sortType}:search:${search}`;
  const cacheMember = await redis.hGet(cacheKey, cacheField);

  if (cacheMember) {
    return res
      .status(200)
      .json(
        new apiResponse(JSON.parse(cacheMember), "Success Fetch all Members"),
      );
  } else {
    const list = await organizationMemberService.listOfAllOrganizationMembers({
      org_Id: orgId,
      limit,
      page,
      sortBy,
      sortType,
      search,
    });

    // set in redis
    await redis.hSet(cacheKey, cacheField, JSON.stringify(list));
    await redis.expire(cacheKey, 60 * 60 * 24);

    return res
      .status(200)
      .json(
        new apiResponse(list, "Success Fetch all Members"),
      );
  }
});
