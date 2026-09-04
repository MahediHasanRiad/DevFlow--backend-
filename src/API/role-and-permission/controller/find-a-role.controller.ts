import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { RoleService } from "../service/role.service.js";

export const FindARoleByIdController = asyncHandler(async (req, res) => {
    const roleId = req.params.roleId as string
    if (!roleId) throw new ApiErrorHandler(400, "Please Provide a Role Id !!")

    const roleService = new RoleService()

    const response = await roleService.findRoleById(roleId);
    if(!response) throw new ApiErrorHandler(404, "Role Not Found")

    res.status(200).json(new apiResponse(response, "Role Found Successfully"));
})