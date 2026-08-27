import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamMemberService } from "../../team-member/service/team-member.service.js";
import { TeamService } from "../../team/service/team.service.js";
import { CreateDailyPlanRequestInputSchema } from "../schema/dailyPlanRequest.schema.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";

export const createDailyPlanRequestController = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;
    if (!userId) throw new ApiErrorHandler(401, 'Unauthorized');

    const { teamId, task, note } = CreateDailyPlanRequestInputSchema.parse(req.body);

    const teamService = new TeamService();
    const team = await teamService.findATeamById(teamId);
    if (!team) throw new ApiErrorHandler(404, 'Team not found');

    // verify
    const teamMemberService = new TeamMemberService();
    const teamMember = await teamMemberService.findTeamMemberByUserId(userId, teamId);
    if (!teamMember) throw new ApiErrorHandler(404, 'Only team member can post plan request');   

    // create daily plan request
    const dailyPlanRequestService = new DailyPlanRequestService();
    const dailyPlanRequest = await dailyPlanRequestService.createDailyPlanRequest({
        userId,
        teamId,
        task,
        note,
    });

    res.status(201).json(new apiResponse(dailyPlanRequest, 'Daily plan request created successfully'));
});