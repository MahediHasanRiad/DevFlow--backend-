import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UserService } from "../../user/service/user.service.js";
import { createOrganizationSchema } from "../schema/organization.schema.js";
import { OrganizationService } from "../service/organization.service.js";

export const createOrganizationController = asyncHandler(async (req, res) => {
  const { name, slug } = createOrganizationSchema.parse(req.body);
  const organizationService = new OrganizationService();

  const userId = req.user?.id as string
  if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

  const userService = new UserService()

  const user = await userService.findUserById(userId)
  if(!user) throw new ApiErrorHandler(404, 'User not found')

  const orgarization = await organizationService.findOrganizationByName(name)
  if(orgarization) throw new ApiErrorHandler(409, 'organization already exist')

  const user_Id = user?.id as string
  const organization  = await organizationService.createOrganization({
    name,
    slug,
    user_Id
  });

  // delete all organization cached
  await redis.del(`all:organizations`)

  res.status(201).json(new apiResponse(organization, "Organization created successfully"));
});
