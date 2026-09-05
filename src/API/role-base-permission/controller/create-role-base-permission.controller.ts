import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import { apiResponse } from "../../../shared/apiResponseHandler.js"
import { asyncHandler } from "../../../shared/asyncHandler.js"
import { OrganizationService } from "../../Organization/service/organization.service.js"
import { PermissionService } from "../../role-and-permission/service/permission.service.js"
import { RoleService } from "../../role-and-permission/service/role.service.js"
import { RoleBasePermissionService } from "../service/role-base-permission.service.js"

export const createRoleBasePermissionController = asyncHandler(async (req, res) => {
    const { roleId, permissionIds } = req.body as { roleId: string, permissionIds: string[] }

    if (!roleId || !permissionIds) {
        throw new ApiErrorHandler(400, "Role ID and Permission ID are required !!")
    }

    const userId = req.user?.id as string

    if (!userId) {
        throw new ApiErrorHandler(401, "Unauthorized !!")
    }

    const roleBasePermissionService = new RoleBasePermissionService()
    const organizationService = new OrganizationService()
    const permissionService = new PermissionService()
    const roleService = new RoleService()

    // verify role id
    const role = await roleService.findRoleById(roleId)
    if (!role) {
        throw new ApiErrorHandler(404, "Role not found !!")
    }

    // verify permission id
    for (const permissionId of permissionIds) {
        const permission = await permissionService.findPermissionById(permissionId)
        if (!permission) throw new ApiErrorHandler(404, `Permission with ID ${permissionId} not found !!`)
    }

    // check already assigned permission
    for (const permissionId of permissionIds) {
        const alreadyAssignedPermission = await roleBasePermissionService.checkAlreadyAssignedPermission(roleId, permissionId)
        if (alreadyAssignedPermission) throw new ApiErrorHandler(400, `Permission with ID ${permissionId} already assigned !!`)
    }

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(role.orgId, userId)
    if (!isAdmin) {
        throw new ApiErrorHandler(403, "You are not authorized to create role base permission !!")
    }

    // create role base permission
    const roleBasePermission = await roleBasePermissionService.createRoleBasePermission(roleId, permissionIds)

    return res.status(201).json(new apiResponse(roleBasePermission, "Role Base Permission Added successfully !!"))
})