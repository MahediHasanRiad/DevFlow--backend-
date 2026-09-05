import { prisma } from "../../../lib/prisma.js"
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"


export class PermissionService {

    async createPermission(name:string, orgId:string){
        try {
            const permission = await prisma.permission.create({
                data: {
                    name:name.toUpperCase(),
                    orgId
                }
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Creating Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async findPermissionByName(name:string, orgId:string){
        try {
            const permission = await prisma.permission.findFirst({
                where: {
                    orgId,
                    name: name
                }
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Finding Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async findPermissionById(permissionId:string){
        try {
            const permission = await prisma.permission.findUnique({
                where: {
                    id: permissionId
                }
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Finding Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async deletePermission(permissionId:string){
        try {
            const permission = await prisma.permission.delete({
                where: {
                    id: permissionId
                }
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Deleting Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async getAllPermissionByOrgId(orgId:string){
        try {
            const permission = await prisma.permission.findMany({
                where: {
                    orgId
                }
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Listing Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async createMultiplePermissions(orgId:string, permissions:string[]){
        try {
            const permission = await prisma.permission.createMany({
                data: permissions.map(permission => ({
                    name: permission.trim().toUpperCase(),
                    orgId: orgId
                })),
                skipDuplicates: true 
            })
    
            return permission
        } catch (error:any) {
            console.error("Error Creating Multiple Permissions : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async getPermissionsByRoleId(roleId:string){
        try {
            const permission = await prisma.rolePermission.findMany({
                where: {
                    roleId: roleId
                },
                include: {
                    permission:{
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            const setPermission = permission.map((item:any) => item.permission.name)

            return {permission: setPermission} 
    
        } catch (error:any) {
            console.error("Error Listing Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }
    
}