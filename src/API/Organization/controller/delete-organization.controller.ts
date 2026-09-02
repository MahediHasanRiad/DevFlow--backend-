import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import { apiResponse } from "../../../shared/apiResponseHandler.js"
import { asyncHandler } from "../../../shared/asyncHandler.js"
import { OrganizationService } from "../service/organization.service.js"

export const deleteOrganizationController = asyncHandler(async(req, res) =>{
    const organizationId = req.params.organizationId as string
    if(!organizationId) throw new ApiErrorHandler(400, 'Organization ID is required')

    const organizationService = new OrganizationService()
    const organization = await organizationService.findOrganizationById(organizationId)

    if(!organization) throw new ApiErrorHandler(404, 'Organization not found')
    if(organization.userId !== req.user?.id) throw new ApiErrorHandler(403, 'You are not authorized to access this organization')

    await organizationService.deleteOrganizationById(organizationId)

    res.status(200).json(new apiResponse(null, 'Organization deleted successfully'))
})