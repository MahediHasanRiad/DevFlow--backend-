import { prisma } from "../../../lib/prisma.js"
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js"
import type { RoleType } from "../schema/role-base-permission.schema.js"

export class RoleBasePermissionService {

    async checkAlreadyAssignedPermission(roleId: string, permissionId: string){
        try {
            const existingPermission = await prisma.rolePermission.findFirst({
                where: {
                    AND: [
                        { roleId },
                        { permissionId }
                    ]
                }
            })

            if(existingPermission){
                return true
            }

            return false
        } catch (error: any) {
            console.error("Error Checking Already Assigned Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async checkPermissionExists(roleId: string, permissionIds: string[]){
        try {
            const permission = await prisma.rolePermission.findMany({
                where:{
                    AND: [
                        { roleId },
                        { permissionId: { in: permissionIds } }
                    ]
                }
            })
            return permission
        } catch (error: any) {
            console.error("Error Checking Permission Exists : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async createRoleBasePermission(roleId: string, permissionIds: string[]){
        try {
            const roleBasePermission = await prisma.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({
                    roleId:roleId,
                    permissionId:permissionId
                }))
            })
            return roleBasePermission
        } catch (error: any) {
            console.error("Error Creating Role Base Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async getPermissionsByRole(roleId: string){
        try {
            const permission = await prisma.rolePermission.findMany({
                where: {
                    roleId:roleId
                },
                include:{
                    role:{
                        select:{
                            id:true,
                            name:true
                        }
                    },
                    permission:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            })
            return permission
        } catch (error: any) {
            console.error("Error Getting Permission By Role : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async removePermissionsByRole(roleId: string, permissionIds: string[]){
        try {
            const removedPermission = await prisma.rolePermission.deleteMany({
                where: {
                    AND: [
                        { roleId },
                        { permissionId: { in: permissionIds } }
                    ]
                }
            })
            return removedPermission
        } catch (error: any) {
            console.error("Error Removing Permissions By Role : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }

    async getRoleListWithPermission(orgId: string){
        try {
            const roleList = await prisma.role.findMany({
                where: {
                    orgId: orgId
                },
                select:{
                    id:true,
                    name:true
                }
            })

            const roleListWithPermission = await Promise.all(roleList.map(async(role:RoleType) => {
                const permissions = await this.getPermissionsByRole(role.id)

                const permissionNames: string[] = []
                permissions.forEach(async(permission:any) => {
                    permissionNames.push(permission.permission.name)
                })
  
                if(permissions.length === 0){
                    await this.createRoleBasePermission(role.id, [])
                }

                return {
                    role: role,
                    permissions: permissionNames
                }
            }))

            return roleListWithPermission
        } catch (error: any) {
            console.error("Error Getting Role List With Permission : ", error)
            throw new ApiErrorHandler(500, error.message || "Internal Server Error !!")
        }
    }
}