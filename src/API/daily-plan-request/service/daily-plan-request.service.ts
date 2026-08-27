import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { prisma } from "../../../lib/prisma.js";
import type { CreateDailyPlanRequestInputType, DailyPlanRequestStatusType } from "../schema/dailyPlanRequest.schema.js";

export interface CreateDailyPlanRequestData {
    userId: string;
    teamId: string;
    task: string;
    note: string;
}

export class DailyPlanRequestService {

    async createDailyPlanRequest({ userId, teamId, task, note }: CreateDailyPlanRequestData) {
        try {
            const response = await prisma.dailyPlanRequest.create({
                data: {
                    userId,
                    teamId,
                    task,
                    note,
                    date: new Date(),
                    status: "PENDING",
                }
            })
            return response

        } catch (error) {
            console.error(error);
            throw new ApiErrorHandler(
                400,
                error instanceof Error ? error.message : String(error),
            );
        }
    }

}