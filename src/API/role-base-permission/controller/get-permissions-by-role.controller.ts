import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { RoleService } from "../../role-and-permission/service/role.service.js";
import { RoleBasePermissionService } from "../service/role-base-permission.service.js";

export const getPermissionByRoleController = asyncHandler(async(req, res) => {

    const {roleId} = req.params as {roleId : string}

    const roleBasePermissionService = new RoleBasePermissionService()
    const roleService = new RoleService()

    const role = await roleService.findRoleById(roleId)
    if(!role){
        throw new ApiErrorHandler(404, "Role not found !!")
    }

    const permission = await roleBasePermissionService.getPermissionsByRole(roleId)

    return res.status(200).json(new apiResponse(permission, "Permission fetched successfully !!"))

})