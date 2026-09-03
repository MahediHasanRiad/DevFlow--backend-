import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationMemberService } from "../service/organization-member.service.js";

export const FindAOrganizationMemberController = asyncHandler(async (req, res)=>{

    const memberId = req.params.memberId as string
    const organizationMemberService = new OrganizationMemberService()

    const findOrganizationMember = await organizationMemberService.findOrganizationMemberById(memberId)

    if(!findOrganizationMember){
        throw new ApiErrorHandler(404, "Organization member not found")
    }

    return res.status(200).json(new apiResponse(findOrganizationMember, "Organization member found successfully"))
})