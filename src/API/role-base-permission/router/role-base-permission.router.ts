import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createRoleBasePermissionController } from "../controller/create-role-base-permission.controller.js";
import { getPermissionByRoleController } from "../controller/get-permissions-by-role.controller.js";
import { removePermissionByRoleController } from "../controller/remove-permissions-by-role.controller.js";
import { listOfAllRoleWithPermissionsController } from "../controller/list-of-all-role-with-permission.controller.js";


const roleBasePermissionRouter = Router()


roleBasePermissionRouter.post('/create', authVerify, createRoleBasePermissionController)
roleBasePermissionRouter.get('/get-by-role/:roleId', authVerify, getPermissionByRoleController)
roleBasePermissionRouter.patch(
    '/remove-permissions/:roleId',
    authVerify,
    removePermissionByRoleController
)
roleBasePermissionRouter.get('/list-of-all-role-with-permissions/:orgId', authVerify, listOfAllRoleWithPermissionsController)

export { roleBasePermissionRouter }