import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { PermissionService } from "../service/permission.service.js";

export const createPermissionController = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string
    if (!userId) throw new ApiErrorHandler(401, "Unauthorized User !!")

    
    const { name, orgId } = req.body as {name:string, orgId:string}

    const organizationService = new OrganizationService()
    const permissionService = new PermissionService()

    const organization = await organizationService.findOrganizationById(orgId)
    if(!organization){
        throw new ApiErrorHandler(404, "Organization Not Found !!") 
    }

    const findPermission = await permissionService.findPermissionByName(name, orgId)
    if(findPermission){
        throw new ApiErrorHandler(409, "Permission Already Exist !!")
    } 

    // verify permission
    const isAdmin = await organizationService.checkOrgAdmin(orgId, userId)
    if(!isAdmin){
        throw new ApiErrorHandler(403, "You are Not Authorized to Create Permission in This Organization !!")
    }

    // create permission
    const permission = await permissionService.createPermission(name, orgId)

    return res.status(201).json(new apiResponse(permission, 'Permission Created Successfully !!'))
    
})