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

const router = Router();

router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.get("/:id/roles", getUserRolesController);

router.get(
  "/users/:id/roles",
  requireAuth,
  requireRole("ROLE_ADMIN"),
  getUserRolesController,
);

router.post(
  "/users/:id/roles",
  requireAuth,
  requireRole("ROLE_ADMIN"),
  addUserRoleController,
);

router.delete(
  "/users/:id/roles",
  requireAuth,
  requireRole("ROLE_ADMIN"),
  removeUserRoleController,
);

export default router;
