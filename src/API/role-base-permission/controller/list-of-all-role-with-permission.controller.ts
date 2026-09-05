import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleBasePermissionService } from "../service/role-base-permission.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const listOfAllRoleWithPermissionsController = asyncHandler(async (req, res) => {

    const orgId = req.params.orgId as string
    if (!orgId) {
        throw new ApiErrorHandler(400, 'Organization id is required !!')
    }

    const organizationService = new OrganizationService()
    const rolePermissionService = new RoleBasePermissionService()

    // find orgarization
    const organization = await organizationService.findOrganizationById(orgId)
    if (!organization) {
        throw new ApiErrorHandler(404, 'Organization not found !!')
    }

    // list of all role with permission
    const roleListWithPermission = await rolePermissionService.getRoleListWithPermission(orgId)

    return res.status(200).json(new apiResponse(roleListWithPermission, "Role list with permission fetched successfully !!"))


})