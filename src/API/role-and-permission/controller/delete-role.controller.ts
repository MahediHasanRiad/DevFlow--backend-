import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleService } from "../service/role.service.js";

export const deleteRoleController = asyncHandler(async (req, res) => {

    const userId = req.user?.id as string
    if (!userId) throw new ApiErrorHandler(401, "Unauthorized User !!")

    const roleId = req.params.roleId as string
    if (!roleId) throw new ApiErrorHandler(400, "Please Provide a Role Id !!")

    const roleService = new RoleService()
    const organizationService = new OrganizationService();

    const roleExists = await roleService.findRoleById(roleId);
    if(!roleExists) throw new ApiErrorHandler(404, "Role Not Found")

    // verification
    const adminCheck = await organizationService.checkOrgAdmin(roleExists.orgId, userId)
    if(!adminCheck){
      throw new ApiErrorHandler(403, "Only Admin Can Delete Role !!");
    }

    // delete
    const response = await roleService.deleteRole(roleId);

    res.status(200).json(new apiResponse(response, "Role Deleted Successfully"));
})