import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { createOrganizationMemberSchema } from "../schema/organization.schema.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const addNewMembersController = asyncHandler(async (req, res) => {

  const { organizationId, userId, role, designation } =
    createOrganizationMemberSchema.parse(req.body);

  const organizationMemberService = new OrganizationMemberService();
  const organizationService = new OrganizationService();

  const user_Id = req.user?.id as string;

  if (!user_Id) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  const findOrganization =
    await organizationService.findOrganizationById(organizationId);
  if (!findOrganization)
    throw new ApiErrorHandler(404, "Organization not found");

  const checkRoleInOrg =
    await organizationMemberService.findOrganizationMemberByUserId({
      userId: user_Id,
      organizationId,
    });

  if (checkRoleInOrg) {
    if (checkRoleInOrg?.organizationId !== organizationId) {
      throw new ApiErrorHandler(403, "User not found in this organization");
    }

    if (
      checkRoleInOrg?.role !== "ADMIN" ||
      checkRoleInOrg?.role !== "PROJECT_MANAGER"
    ) {
      throw new ApiErrorHandler(403, "You are not allowed to add a new member !!");
    }

    const addNewMember = await organizationMemberService.addNewMember({
      organizationId,
      userId,
      role,
      designation,
    });

    return res
      .status(201)
      .json(new apiResponse(addNewMember, "Successfully Created !!!"));
  }

  // create
  if (!checkRoleInOrg) {
    const checkOrgAdmin = await organizationService.checkOrgAdmin(user_Id);
    if (!checkOrgAdmin)
      throw new ApiErrorHandler(403, "You are not allowed to add a new member  !!!");

    const addNewMember = await organizationMemberService.addNewMember({
      organizationId,
      userId,
      role,
      designation,
    });
    res
      .status(201)
      .json(new apiResponse(addNewMember, "successfully create a new Team"));
  }
});
