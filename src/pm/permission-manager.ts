import { PermissionService } from "../API/role-and-permission/service/permission.service.js";
import { ApiErrorHandler } from "../shared/apiErrorHandler.js";

export class PermissionManager {
    private cachedPermissions: string[] | null = null 

    constructor(
        public readonly organizationRole: string,
    ) {
        this.setPermissionsInCached() 
    }

    async hasPermission(permission:string){
        try {      
            if(this.cachedPermissions === null) {
                await this.setPermissionsInCached()
            }  

            const hasPermissions = this.cachedPermissions?.includes(permission.toUpperCase())
            return hasPermissions
        } catch (error) {
            console.log(error)
        }
    }

    private async setPermissionsInCached() {
        if (this.cachedPermissions !== null) {
            return this.cachedPermissions; 
        }
        try {
            const permissionService = new PermissionService();
            const permissions = await permissionService.getPermissionsByRoleId(this.organizationRole);
            this.cachedPermissions = permissions?.permission || [];
        } catch (error: any) {
            console.error(error);
            throw new ApiErrorHandler(error?.message || 'Failed to load permissions');
        }
    }
    
}

