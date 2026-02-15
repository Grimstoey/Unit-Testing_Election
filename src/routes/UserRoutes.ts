import { Router } from "express";
import {getAllUsersController, getUserByIdController, getUserByCitizenIdController} from "../controllers/UserController";

const router = Router();

// Get /users/
router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.get("/citizen/:citizenId", getUserByCitizenIdController);

export default router;
