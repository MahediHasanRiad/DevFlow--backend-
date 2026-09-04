import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { RoleService } from "../service/role.service.js";
 
export const createRoleController = asyncHandler(async(req, res) => {
    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized User !!')

    const roleService = new RoleService()

    const findRole = await roleService.findRoleByName(req.body.name)
    if(findRole) throw new ApiErrorHandler(400, 'Role Already Exist !!')

    // verification 
    if(req?.user?.orgRole !== 'ADMIN') throw new ApiErrorHandler(403, 'Not Authorized For This Action !!')

    // create
    const createRole = await roleService.createRole(req.body.name, req.body.orgId)

    res.status(201).json(new apiResponse(createRole, 'Role Created Successfully !!'))

})