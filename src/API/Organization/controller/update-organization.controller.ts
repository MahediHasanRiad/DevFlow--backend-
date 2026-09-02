import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { OrganizationService } from "../service/organization.service.js";
import { updateOrganizationSchema } from "../schema/organization.schema.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import redis from "../../../config/redis.js";

export const updateOrganizationController = asyncHandler(async(req, res) => {
    const organizationId = req.params.organizationId as string
    if(!organizationId) throw new ApiErrorHandler(400, "Organization ID is required")

    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'Unauthorized')

    const {name, slug} = updateOrganizationSchema.parse(req.body)

    const organizationService = new OrganizationService()

    
    const organization = await organizationService.findOrganizationById(organizationId)
    if(!organization) throw new ApiErrorHandler(404, "Organization not found")

    // verification
    if(userId !== organization.userId) throw new ApiErrorHandler(403, 'You are not authorized to update this organization')
    if(name){
        const existingOrganization = await organizationService.findOrganizationByName(name)
        if(existingOrganization) throw new ApiErrorHandler(400, "Organization name already exists")
    }

    const updatedOrganization = await organizationService.updateOrganization(organizationId, {name, slug})

    // delele all orgarization list from redis
    await redis.del(`all:organizations`)

    res.status(200).json(new apiResponse(updatedOrganization, 'Organization updated successfully'))

})