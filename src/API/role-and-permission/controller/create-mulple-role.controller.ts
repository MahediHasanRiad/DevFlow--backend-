import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleService } from "../service/role.service.js";

export const createMultipleRolesController = asyncHandler(async (req, res) => {
    
    const userId = req.user?.id as string
    const { roles } = req.body as {roles: string[]}

    if(!userId){
        throw new ApiErrorHandler(401, "Unauthorized !!")
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new ApiErrorHandler(400, "Roles array is required and must not be empty !!")
    }

    const organizationService = new OrganizationService()
    const roleService = new RoleService()

    // finding organization by user id
    const organization = await organizationService.findOrganizationByUserId(userId)
    if(!organization){
        throw new ApiErrorHandler(404, "Organization Not Found !!")
    }

    // check role name already exist in organization
    for (const role of roles) {
      const roleExist = await roleService.findRoleByName(organization.id, role)
      if (roleExist) {
        throw new ApiErrorHandler(400, `Role ${role} Already Exist !!`)
      }
    }

    // verification
    const isAdmin = await organizationService.checkOrgAdmin(organization.id, userId)
    if(!isAdmin){
        throw new ApiErrorHandler(403, "Only Admin Can Perform This Action !!")
    }

    // create multiple roles
    const response = await roleService.createMultipleRoles(organization.id, roles)

    return res.status(201).json(new apiResponse(response, "Roles Created Successfully !!"))
})