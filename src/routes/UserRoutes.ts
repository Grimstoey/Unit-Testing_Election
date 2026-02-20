import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
} from "../controllers/UserController";
import { getUserRolesController } from "../controllers/UserController";

const router = Router();

// Get /users/
router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.get("/:id/roles", getUserRolesController);



export default router;
