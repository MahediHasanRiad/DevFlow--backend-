import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleService } from "../service/role.service.js";

export const getAllRoleByOrgIdController = asyncHandler(async (req, res) => {
    const orgId = req.params.orgId as string
    if (!orgId) throw new ApiErrorHandler(400, "Please Provide an Organization Id !!")

    const roleService = new RoleService()
    const orgService = new OrganizationService()

    const orgExists = await orgService.findOrganizationById(orgId);
    if(!orgExists) throw new ApiErrorHandler(404, "Organization Not Found")

    const response = await roleService.getAllRoleByOrgId(orgId);
    if(!response) throw new ApiErrorHandler(404, "Roles Not Found")

    res.status(200).json(new apiResponse(response, "Roles Found Successfully"));
})