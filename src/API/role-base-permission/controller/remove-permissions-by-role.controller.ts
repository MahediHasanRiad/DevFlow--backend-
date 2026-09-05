import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleService } from "../../role-and-permission/service/role.service.js";
import { RoleBasePermissionService } from "../service/role-base-permission.service.js";

export const removePermissionByRoleController = asyncHandler(async(req, res) => {

    const { roleId } = req.params as {roleId: string}
    const { permissionIds } = req.body as {permissionIds: string[]}

    if(!roleId){
        throw new ApiErrorHandler(400, "Role id is required !!")
    }

    if(!permissionIds || permissionIds.length === 0){
        throw new ApiErrorHandler(400, "Permission ids are required !!")
    }

    const roleBasePermissionService = new RoleBasePermissionService()
    const roleService = new RoleService()
    const organizationService = new OrganizationService()

    const role = await roleService.findRoleById(roleId)
    if(!role){
        throw new ApiErrorHandler(404, "Role not found !!")
    }

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(role?.orgId, req.user?.id as string)
    if(!isAdmin){
        throw new ApiErrorHandler(403, "You are not authorized to perform this action !!")
    }

    // check permission exists
    const permission = await roleBasePermissionService.checkPermissionExists(roleId, permissionIds)
    if(permission.length === 0){
        throw new ApiErrorHandler(404, "Permission not found !!")
    }

    // remove permission
    const removedPermission = await roleBasePermissionService.removePermissionsByRole(roleId, permissionIds)
    
    return res.status(200).json(new apiResponse(removedPermission, "Permission removed successfully !!"))
})