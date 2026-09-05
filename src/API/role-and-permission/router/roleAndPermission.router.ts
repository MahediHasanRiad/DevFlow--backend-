import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createRoleController } from "../controller/create-role.controller.js";
import { FindARoleByIdController } from "../controller/find-a-role.controller.js";
import { deleteRoleController } from "../controller/delete-role.controller.js";
import { getAllRoleByOrgIdController } from "../controller/list-of-all-role-by-org.controller.js";
import { createPermissionController } from "../controller/create-permission.controller.js";
import { findPermissionByIdController } from "../controller/find-a-permission.controller.js";
import { getAllPermissionByOrgIdController } from "../controller/list-of-all-permission-by-org.controller.js";
import { deletePermissionController } from "../controller/delete-permission.controller.js";


const roleAndPermissionRouter = Router()

// role
roleAndPermissionRouter.post('/create-a-role', authVerify, createRoleController)
roleAndPermissionRouter.get('/find-a-role/:roleId', authVerify, FindARoleByIdController)
roleAndPermissionRouter.get('/find-all-role-by-org/:orgId', authVerify, getAllRoleByOrgIdController)
roleAndPermissionRouter.delete('/delete-a-role/:roleId', authVerify, deleteRoleController)

// permissions
roleAndPermissionRouter.post('/create-a-permission', authVerify, createPermissionController)
roleAndPermissionRouter.get('/find-a-permission/:permissionId', authVerify, findPermissionByIdController)
roleAndPermissionRouter.get('/find-all-permission-by-org/:orgId', authVerify, getAllPermissionByOrgIdController)
roleAndPermissionRouter.delete('/delete-a-permission/:permissionId', authVerify, deletePermissionController)




export {roleAndPermissionRouter}