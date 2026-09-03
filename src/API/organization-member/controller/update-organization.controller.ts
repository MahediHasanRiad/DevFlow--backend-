import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { updateOrganizationMemberSchema } from "../schema/organization.schema.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const updateMemberController = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  const memberId = req.params.memberId as string;
  if (!memberId) throw new ApiErrorHandler(404, "member id required");

  const organizationMemberService = new OrganizationMemberService();

  const findOrganizationMember =
    await organizationMemberService.findOrganizationMemberById(memberId);

  const { role, designation } = updateOrganizationMemberSchema.parse(req.body);

  if (!findOrganizationMember)
    throw new ApiErrorHandler(404, "Organization not found !!!");

  const update = await organizationMemberService.updateOrganizationMember({
    id: findOrganizationMember.id,
    role,
    designation,
  });

  res.status(200).json(new apiResponse(update, "Successfully Updated"));
});
