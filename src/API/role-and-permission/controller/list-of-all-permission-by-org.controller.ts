import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { PermissionService } from "../service/permission.service.js";

export const getAllPermissionByOrgIdController = asyncHandler(async(req,res)=>{
    const orgId = req.params.orgId as string
    const userId = req.user?.id as string

    if(!orgId){
        throw new ApiErrorHandler(400, "Organization Id is Required !!")
    }

    if(!userId){
        throw new ApiErrorHandler(401, "Unauthorized !!")
    }

    const organizationService = new OrganizationService()
    const permissionService = new PermissionService()

    const organization = await organizationService.findOrganizationById(orgId)

    if(!organization){
        throw new ApiErrorHandler(404, "Organization Not Found !!")
    }

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(orgId, userId)
    if(!isAdmin){
        throw new ApiErrorHandler(403, "Only Admin Can Perform This Action !!")
    }

    const permission = await permissionService.getAllPermissionByOrgId(orgId)

    return res.status(200).json(new apiResponse(permission, 'Permissions Found Successfully !!'))
})