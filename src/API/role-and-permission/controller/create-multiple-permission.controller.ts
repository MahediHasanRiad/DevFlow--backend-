import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { PermissionService } from "../service/permission.service.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";



export const createMultiplePermissionsController = asyncHandler(async (req, res) => {
    
    const { permissions } = req.body as {permissions: string[]}
    const userId = req.user?.id as string

    if (!userId) {
        throw new ApiErrorHandler(401, "Unauthorized")
    }

    if (!permissions || permissions.length === 0) {
        throw new ApiErrorHandler(400, "Permissions Array is Required !!")
    }

    const permissionService = new PermissionService()
    const organizationService = new OrganizationService()

    // find organization by user id
    const organization = await organizationService.findOrganizationByUserId(userId)
    if (!organization) {
        throw new ApiErrorHandler(404, "Organization Not Found !!")
    }

    // check permission name already exist in organization
    permissions.forEach(async permission => {
        const permissionExist = await permissionService.findPermissionByName(permission, organization.id)
        if (permissionExist) {
            throw new ApiErrorHandler(400, `Permission ${permission} Already Exist !!`)
        }
    })

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(organization.id, userId)
    if (!isAdmin) {
        throw new ApiErrorHandler(403, "Only Admin Can Perform This Action !!")
    }

    // create multiple permissions
    const response = await permissionService.createMultiplePermissions(organization.id, permissions)

    return res.status(201).json(new apiResponse(response, "Permissions Created Successfully !!"))
})