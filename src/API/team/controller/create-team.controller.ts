import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationMemberService } from "../../organization-member/service/organization-member.service.js";
import { OrganizationService } from "../../Organization/service/organization.service.js";
import { CreateTeamInputSchema } from "../schema/team.schema.js";
import { TeamService } from "../service/team.service.js";

export const createTeamController = asyncHandler(async (req, res) => {
  const user_Id = req?.user?.id as string;
  if (!user_Id) throw new ApiErrorHandler(401, "Unauthorized");

  const { name, description, organizationId } = CreateTeamInputSchema.parse(
    req.body,
  );

  const teamService = new TeamService();
  const organizationService = new OrganizationService();
  const organizationMemberService = new OrganizationMemberService();

  const checkOrganizationExist =
    await organizationService.findOrganizationById(organizationId);
  if (!checkOrganizationExist) {
    throw new ApiErrorHandler(404, "Organization not found");
  }

  const checkMember =
    await organizationMemberService.findOrganizationMemberByUserId({
      userId: user_Id,
      organizationId,
    });

  if (checkMember) {
    // verification
    if (
      checkMember?.role !== "ADMIN" &&
      checkMember?.role !== "PROJECT_MANAGER"
    ) {
      throw new ApiErrorHandler(403, "You are not allowed to create a team");
    }

    // create
    const addTeam = await teamService.addNewTeam({
      name,
      description,
      createdById: user_Id,
      organizationId,
    });
    res
      .status(201)
      .json(new apiResponse(addTeam, "successfully create a new Team"));
  } else {
    const checkOrganization = await organizationService.checkOrgAdmin(user_Id);
    
    // create
    if (checkOrganization) {
      const addTeam = await teamService.addNewTeam({
        name,
        description,
        createdById: user_Id,
        organizationId,
      });

      // delete cash
      await redis.del(`teams:${organizationId}:`)
      

      res
        .status(201)
        .json(new apiResponse(addTeam, "successfully create a new Team"));
    }
  }
});
