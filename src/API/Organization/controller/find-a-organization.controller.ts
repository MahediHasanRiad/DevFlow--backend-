import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { OrganizationService } from "../service/organization.service.js";

export const getOrganizationController = asyncHandler(async (req, res) => {
  const organizationId = req.params.organizationId as string;
  if (!organizationId) throw new ApiErrorHandler(400, "Organization ID is required");

  const organizationService = new OrganizationService();
  const organization = await organizationService.findOrganizationById(organizationId);

  if (!organization) throw new ApiErrorHandler(404, "Organization not found");

  res.status(200).json(new apiResponse(organization, "Organization fetched successfully"));
});