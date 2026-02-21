import { Router } from "express";
import { requireAuth } from "@/middlewares/AuthMiddleware";
import {
  createConstituencyController,
  deleteConstituencyController,
  editConstituencyController,
  getAllConstituencyWithPaginationController,
} from "@/controllers/AdminController";
import {addUserRoleController, getAllUsersController, getUserRolesController, removeUserRoleController} from "../controllers/UserController";
import { requireRole } from "@/middlewares/RoleMiddleware";
import { RoleName } from "@/models/role/roleNameDto";



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

router.post(
  "users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  addUserRoleController,
);

router.delete(
  "users/:id/roles",
  requireAuth,
  requireRole(RoleName.ADMIN),
  removeUserRoleController,
);

// ทำ post อัพเดต role --> PUT /users/:id/roles 

export default router;
