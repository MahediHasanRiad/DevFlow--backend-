import { PermissionManager } from "../../../pm/permission-manager.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { updateOrganizationMemberSchema } from "../schema/organization.schema.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const updateMemberController = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  const myRole = req.user?.orgRole as string
  if(!myRole) throw new ApiErrorHandler(404, "Role not found !!!");

  const memberId = req.params.memberId as string;
  if (!memberId) throw new ApiErrorHandler(404, "member id required");

  // instance
  const organizationMemberService = new OrganizationMemberService();
  const permissionManager = new PermissionManager(myRole)

  const findOrganizationMember =
    await organizationMemberService.findOrganizationMemberById(memberId);

  const { roleId } = updateOrganizationMemberSchema.parse(req.body);

  if (!findOrganizationMember)
    throw new ApiErrorHandler(404, "Organization not found !!!");

  // verification
  const hasPermission = await permissionManager.hasPermission('orgMember:update')

  const update = await organizationMemberService.updateOrganizationMember({
    id: findOrganizationMember.id,
    roleId
  });

  res.status(200).json(new apiResponse(update, "Successfully Updated"));
});
