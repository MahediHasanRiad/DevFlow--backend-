import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import { apiResponse } from "../../../shared/apiResponseHandler.js"
import { asyncHandler } from "../../../shared/asyncHandler.js"
import { OrganizationService } from "../../Organization/service/organization.service.js"
import { PermissionService } from "../service/permission.service.js"

export const deletePermissionController = asyncHandler(async(req,res)=>{
    const permissionId = req.params.permissionId as string

    if(!permissionId){
        throw new ApiErrorHandler(400, "Permission Id is Required !!")
    }

    const permissionService = new PermissionService()
    const organizationService = new OrganizationService()

    const permission = await permissionService.findPermissionById(permissionId)
    if(!permission){
        throw new ApiErrorHandler(404, "Permission Not Found !!")
    }

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(permission.orgId, req.user?.id as string)
    if(!isAdmin){
        throw new ApiErrorHandler(403, "Only Admin Can Perform This Action !!")
    }

    await permissionService.deletePermission(permissionId)

    return res.status(200).json(new apiResponse({}, 'Permission Deleted Successfully !!'))
})