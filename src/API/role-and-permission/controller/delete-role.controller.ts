import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { RoleService } from "../service/role.service.js";

export const deleteRoleController = asyncHandler(async (req, res) => {
    const roleId = req.params.roleId as string
    if (!roleId) throw new ApiErrorHandler(400, "Please Provide a Role Id !!")

    const roleService = new RoleService()

    const roleExists = await roleService.findRoleById(roleId);
    if(!roleExists) throw new ApiErrorHandler(404, "Role Not Found")

    const orgId = roleExists.orgId;
    if(orgId !== req.user?.orgId) throw new ApiErrorHandler(403, "You are not authorized to delete this role")

    const response = await roleService.deleteRole(roleId);
    

    res.status(200).json(new apiResponse(response, "Role Deleted Successfully"));
})