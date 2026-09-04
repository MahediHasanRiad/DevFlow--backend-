import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createRoleController } from "../controller/create-role.controller.js";
import { FindARoleByIdController } from "../controller/find-a-role.controller.js";
import { deleteRoleController } from "../controller/delete-role.controller.js";
import { getAllRoleByOrgIdController } from "../controller/list-of-all-role-by-org.controller.js";


const roleAndPermissionRouter = Router()

roleAndPermissionRouter.post('/create-a-role', authVerify, createRoleController)
roleAndPermissionRouter.get('/find-a-role/:roleId', authVerify, FindARoleByIdController)
roleAndPermissionRouter.get('/find-all-role-by-org/:orgId', authVerify, getAllRoleByOrgIdController)
roleAndPermissionRouter.delete('/delete-a-role/:roleId', authVerify, deleteRoleController)



export {roleAndPermissionRouter}