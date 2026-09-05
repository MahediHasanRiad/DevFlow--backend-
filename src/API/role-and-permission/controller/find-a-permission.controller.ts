import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { PermissionService } from "../service/permission.service.js";


export const findPermissionByIdController = asyncHandler(async(req,res)=>{
    const permissionId = req.params.permissionId as string

    if(!permissionId){
        throw new ApiErrorHandler(400, "Permission Id is Required !!")
    }

    const permissionService = new PermissionService()

    const permission = await permissionService.findPermissionById(permissionId)

    return res.status(200).json(new apiResponse(permission, 'Permission Found Successfully !!'))
})