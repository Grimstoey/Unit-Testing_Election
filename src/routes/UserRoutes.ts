import { Router } from "express";
import {getAllUsersController} from "../controllers/UserController";

const router = Router();

// Get /user/all
router.get("/all", getAllUsersController);

export default router;
