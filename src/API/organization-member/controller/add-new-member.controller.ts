import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import { apiResponse } from "../../../shared/apiResponseHandler.js"
import { asyncHandler } from "../../../shared/asyncHandler.js"
import { UserService } from "../../user/service/user.service.js"
import { createOrganizationMemberSchema } from "../schema/organization.schema.js"
import { OrganizationMemberService } from "../service/organization-member.service.js"


export const addNewMembersController = asyncHandler(async(req, res) => {

    const user_id = req.user?.id as string
    if(!user_id) {
        throw new ApiErrorHandler(401, "Unauthorized")
    }

    const { organizationId, userId, role, designation } = createOrganizationMemberSchema.parse(req.body)

    const organizationMemberService = new OrganizationMemberService()
    const userService = new UserService()

    // verification   
    const user_Id = req.user?.id as string
    const findMember = await organizationMemberService.findOrganizationMemberById(user_Id)
    if(!findMember) {
        throw new ApiErrorHandler(404, "Organization Member not found !")
    }

    if(findMember.role !== 'ADMIN' && findMember.role !== 'PROJECT_MANAGER  ') {
        throw new ApiErrorHandler(403, "You don't have permission to add new member !")
    }
 
    const addNewMember = await organizationMemberService.addNewMember({organizationId, userId, role, designation})

    return res.status(201).json(new apiResponse(addNewMember, 'Successfully Created !!!'))
    
})