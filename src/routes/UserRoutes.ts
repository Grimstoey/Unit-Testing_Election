import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
} from "../controllers/UserController";
import {
  getUserRolesController,
  addUserRoleController,
  removeUserRoleController,
} from "../controllers/UserController";
import { requireAuth } from "../middlewares/AuthMiddleware";
import { requireRole } from "../middlewares/RoleMiddleware";
import { RoleName } from "@/models/role/roleNameDto";

const router = Router();

router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.get("/:id/roles", getUserRolesController);

router.get(
  "/users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  getUserRolesController,
);

router.post(
  "/users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  addUserRoleController,
);

router.delete(
  "/users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  removeUserRoleController,
);

export default router;
