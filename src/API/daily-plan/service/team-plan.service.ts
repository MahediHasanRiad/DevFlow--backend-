
import { prisma } from "../../../lib/prisma.js"
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"


export class DailyPlanService {

    async dailyPlan(date: string | Date, teamId: string) {
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
                    status: "APPROVED",
                    teamId: teamId,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                select: {
                    task: true,
                    note: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            designation: true,
                            id: true,
                            avatar: true
                        }   
                    }
                },
            });
            return response;
        } catch (error: any) {
            throw new ApiErrorHandler(error.statusCode || 500, error.message || 'Failed to fetch daily plan');
        }
    }

    async dailyPlanByMonth(teamId: string, month: number, year?: number) {
        try {
            if (month < 1 || month > 12) {
                throw new ApiErrorHandler(400, "Invalid month. Month must be between 1 and 12");
            }

            const currentYear = year ?? new Date().getFullYear();
            const startOfMonth = new Date(Date.UTC(currentYear, month - 1, 1, 0, 0, 0, 0));
            const endOfMonth = new Date(Date.UTC(currentYear, month, 0, 23, 59, 59, 999));

            const response = await prisma.dailyPlanRequest.findMany({
                where: {
                    status: "APPROVED",
                    teamId: teamId,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
                select: {
                    id: true,
                    task: true,
                    note: true,
                    date: true,
                    status: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            designation: true,
                            id: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: {
                    date: "asc",
                },
            });
            return response;
        } catch (error: any) {
            throw new ApiErrorHandler(error.statusCode || 500, error.message || 'Failed to fetch daily plan');
        }
    }   

    

}