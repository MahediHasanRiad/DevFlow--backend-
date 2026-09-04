import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";

export class RoleService {

    async findRoleById(roleId: string){
        try {
            const response = await prisma.role.findFirst({
                where: { id: roleId },
            });
            return response;
        } catch (error:any) {
            console.log(error)
        }
    }

    async findRoleByName(name: string){
        try {
            const response = await prisma.role.findFirst({
                where: { name },
            });
            return response;
        } catch (error:any) {
            console.log(error)
        }
    }

    async createRole(name: string, orgId: string){
        try {
            const createRole = await prisma.role.create({
                data: {
                    name,
                    orgId,
                },
            });

            return createRole;

        } catch (error:any) {
            console.log(error)
            
        }
    }

}