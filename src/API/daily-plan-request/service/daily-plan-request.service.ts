import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { prisma } from "../../../lib/prisma.js";
import type { DailyPlanRequestStatusType, DailyPlanRequestType } from "../schema/dailyPlanRequest.schema.js";


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

    async findADailyPlanRequest(id: string): Promise<DailyPlanRequestType> {
        try {
            const response = await prisma.dailyPlanRequest.findUnique({
                where: { id },
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

    async deleteADailyPlanRequest(id: string): Promise<void> {
        try {
            await prisma.dailyPlanRequest.delete({
                where: { id },
            })
        } catch (error) {
            console.error(error);
            throw new ApiErrorHandler(
                400,
                error instanceof Error ? error.message : String(error),
            );
        }
    }

    async updateADailyPlanRequest(id: string, task?: string, note?: string | null): Promise<DailyPlanRequestType> {
        try {
            const response = await prisma.dailyPlanRequest.update({
                where: { id },
                data: {
                    ...(task !== undefined && { task }),
                    ...(note !== undefined && { note }),
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

    async updateDailyPlanRequestStatus(id: string, status: DailyPlanRequestStatusType): Promise<DailyPlanRequestType> {
        try {
            const response = await prisma.dailyPlanRequest.update({
                where: { id },
                data: { status: status },
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

    async getDailyPlanRequestByDate(date: string | Date):Promise<DailyPlanRequestType[]> {
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new ApiErrorHandler(400, "Invalid date format");
            }

            const startOfDay = new Date(parsedDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(parsedDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const response = await prisma.dailyPlanRequest.findMany({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            designation: true,
                        }
                    },
                    team: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        }
                    }
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