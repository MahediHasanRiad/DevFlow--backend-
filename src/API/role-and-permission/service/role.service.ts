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
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

    async findRoleByName(orgId: string, name: string){
        try {
            const response = await prisma.role.findFirst({
                where: { 
                    AND: [
                        { orgId },
                        { name: name.toUpperCase() },
                    ],
                },
            });
            return response;
        } catch (error:any) {
            console.log(error)
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

    async createRole(name: string, orgId: string){
        try {
            const createRole = await prisma.role.create({
                data: {
                    name: name.toUpperCase(),
                    orgId,
                },
            });

            return createRole;

        } catch (error:any) {
            console.log(error)
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

    async createMultipleRoles(orgId: string, roles: string[]){
        try {
            const createMultipleRoles = await prisma.role.createMany({
                data: roles.map(role => ({
                    name: role.trim().toUpperCase(),
                    orgId,
                })),
                skipDuplicates: true    
            });

            return createMultipleRoles;

        } catch (error:any) {
            console.log(error)
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

    async getAllRoleByOrgId(orgId: string){
        try {
            const response = await prisma.role.findMany({
                where: { orgId },
            });
            return response;
        } catch (error:any) {
            console.log(error)
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

    async deleteRole(roleId: string){
        try {
            const response = await prisma.role.delete({
                where: { id: roleId },
            });
            return response;
        } catch (error:any) {
            console.log(error)
            throw new ApiErrorHandler(500, error.message || error);
        }
    }

}