import { Router } from "express";
import {getAllUsersController} from "../controllers/UserController";

const router = Router();

// Get /users/
router.get("/", getAllUsersController);

export default router;
