import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const deleteOrganizationMemberController = asyncHandler(
  async (req, res) => {
    const memberId = req.params.memberId as string;
    if (!memberId) throw new ApiErrorHandler(404, "member id required");

    const organizationMemberService = new OrganizationMemberService();

    // verification
    if (req.user?.orgRole !== "ADMIN" && req.user?.orgRole !== "PROJECT_MANAGER") {
      throw new ApiErrorHandler(
        403,
        "you are not authorized to perform this action",
      );
    }

    const organizationMember =
      await organizationMemberService.findOrganizationMemberById(memberId);
    if (!organizationMember)
      throw new ApiErrorHandler(404, "organization member not found");

    const deleted =
      await organizationMemberService.deleteOrganizationMember(memberId);

    if (deleted) {
      return res
        .status(200)
        .json({
          message: "Organization member deleted successfully",
          data: deleted,
        });
    }
  },
);
