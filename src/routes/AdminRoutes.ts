import { Router } from "express";
import { requireAuth } from "@/middlewares/AuthMiddleware";
import {
  createConstituencyController,
  deleteConstituencyController,
  editConstituencyController,
  getAllConstituencyWithPaginationController,
} from "@/controllers/ConstituencyController";
import {
  getAllUsersController,
  getUserRolesController,
  removeUserRoleController,
} from "../controllers/UserController";
import { requireRole } from "@/middlewares/RoleMiddleware";
import { RoleName } from "@/models/role/roleNameDto";
import { assignRoleController } from "@/controllers/UserRoleController";

const router = Router();

router.get(
  "/constituencies",
  requireAuth,
  getAllConstituencyWithPaginationController,
);

router.post("/constituencies", requireAuth, createConstituencyController);
router.delete("/constituencies/:id", requireAuth, deleteConstituencyController);
router.put("/constituencies/:id", requireAuth, editConstituencyController);

router.get("/users", getAllUsersController);

router.get(
  "users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  getUserRolesController,
);

router.delete(
  "users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  removeUserRoleController,
);

router.post("/users/:userId/roles", assignRoleController);

export default router;
