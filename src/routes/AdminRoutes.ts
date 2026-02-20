import {
    createConstituencyController, deleteConstituencyController, editConstituencyController,
    findAllConstituenciesController,
    findAllUserController, getAllConstituencyWithPaginationController
} from '@/controllers/AdminController'
import { Router } from 'express'
import * as service from "../services/AdminService";
import {
    addConstituency,
    deleteConstituency,
    editConstituency,
    getConstituencyById, getUserByRole
} from "@/repositories/AdminRepository";
import * as console from "node:console";
//import {CreateConstituencyService, findAllConstituenciesService} from "../services/AdminService";
import {requireAuth} from "@/middlewares/AuthMiddleware";
import {getAllConstituencyWithPagination} from "../services/AdminService";

const router = Router()

// POST /auth/register
router.get('/constituencies',requireAuth, getAllConstituencyWithPaginationController)
router.get('/users', findAllUserController)
router.get("/constituencies/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const event = await getConstituencyById(id);
    if (event) {
        res.json(event);
    } else {
        res.status(404).send("Event not found");
    }
});
router.get("/users/:role", async (req, res) => {
    const role = req.params.role;
    const event = await getUserByRole(role);
    if (event) {
        res.json(event);
    } else {
        res.status(404).send("Event not found");
    }
});
router.post('/constituencies', requireAuth, createConstituencyController);
router.delete('/constituencies/:id', requireAuth, deleteConstituencyController);
router.put('/constituencies/:id', requireAuth, editConstituencyController);



export default router
