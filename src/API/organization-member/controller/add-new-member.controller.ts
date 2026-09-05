import redis from "../../../config/redis.js";
import { PermissionManager } from "../../../pm/permission-manager.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { createOrganizationMemberSchema } from "../schema/organization.schema.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const addNewMembersController = asyncHandler(async (req, res) => {

  const { organizationId, userId, roleId } =
    createOrganizationMemberSchema.parse(req.body);

  const organizationMemberService = new OrganizationMemberService();
  const organizationService = new OrganizationService();

  const user_Id = req.user?.id as string;

  if (!user_Id) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  // verification by permission
  const myRole = req.user?.orgRole as string;
  const permissionManager = new PermissionManager(myRole)

  if (!permissionManager.hasPermission("org-member:add")) {
    throw new ApiErrorHandler(403, "You are not allowed to add a new member !!");
  }

  const findOrganization =
    await organizationService.findOrganizationById(organizationId);
  if (!findOrganization)
    throw new ApiErrorHandler(404, "Organization not found");

  const checkExistUser =
    await organizationMemberService.findOrganizationMemberByUserId({
      userId: userId,
      organizationId,
    });

  if (checkExistUser) throw new ApiErrorHandler(400, "User already exists in this organization");


  // create new member in organization
  const addNewMember = await organizationMemberService.addNewMember({
    organizationId,
    userId: userId,
    roleId,
  });


  // clear cache
  const cacheKey = `organization-member:${organizationId}:*`;
  await redis.del(cacheKey);


  res
    .status(201)
    .json(new apiResponse(addNewMember, "successfully create a new Team"));
});
