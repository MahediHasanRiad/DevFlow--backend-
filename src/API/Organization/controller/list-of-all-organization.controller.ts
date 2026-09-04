import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { OrganizationService } from "../service/organization.service.js";
import type { QueryType } from "../../types/types.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import redis from "../../../config/redis.js";

export const getAllOrganizationsController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  let {
    page = 1,
    limit = 10,
    sortBy = "asc",
    sortType = "createdAt",
    search = "",
  } = req.query as QueryType;
  page = Number(page);
  limit = Number(limit);

  // get from redis
  const allOrganizations = await redis.hGet(
    `all:organizations`,
    `${page}:${limit}:${sortBy}:${sortType}:${search}`,
  );

  if (allOrganizations) {
    return res
      .status(200)
      .json(
        new apiResponse(
          JSON.parse(allOrganizations),
          "List of all organizations",
        ),
      );
  } else {
    const organizationService = new OrganizationService();
    const response = await organizationService.listOfAllOrganization({
      page,
      limit,
      sortBy,
      sortType,
      search,
    }); 

    // set in redis
    await redis.hSet(
      `all:organizations`,
      `${page}:${limit}:${sortBy}:${sortType}:${search}`,
      JSON.stringify(response),
    );
    await redis.expire(`all:organizations`, 300)

    return res
      .status(200)
      .json(new apiResponse(response, "List of all organizations"));
  }
});
