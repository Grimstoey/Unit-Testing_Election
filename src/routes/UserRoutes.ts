import { Router } from "express";
import {getAllUsersController, getUserByIdController} from "../controllers/UserController";

const router = Router();

// Get /users/
router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);



export default router;
