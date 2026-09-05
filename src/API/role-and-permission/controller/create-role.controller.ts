import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { RoleService } from "../service/role.service.js";

export const createRoleController = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized User !!");

  // class instances
  const roleService = new RoleService();
  const organizationService = new OrganizationService();

  
  const organization = await organizationService.findOrganizationByUserId(userId);
  if (!organization)
    throw new ApiErrorHandler(404, "Organization Not Found !!");

  const findRole = await roleService.findRoleByName(organization.id, req.body.name);
  if (findRole) throw new ApiErrorHandler(400, "Role Already Exist !!");
 
  // verification
  const adminCheck = await organizationService.checkOrgAdmin(organization.id, userId)
  if(!adminCheck){
    throw new ApiErrorHandler(403, "Only Admin Can Create Role !!");
  }

  // create
  const createRole = await roleService.createRole(req.body.name, organization.id);

  res
    .status(201)
    .json(new apiResponse(createRole, "Role Created Successfully !!"));
});
