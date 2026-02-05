import {findAllConstituenciesController, findAllUserController} from '@/controllers/AdminController'
import { Router } from 'express'
import * as service from "../services/AdminService";
import {
    addConstituency,
    deleteConstituency,
    editConstituency,
    getConstituencyById, getUserByRole
} from "@/repositories/AdminRepository";
import * as console from "node:console";
import {findAllConstituenciesService} from "../services/AdminService";

const router = Router()

// POST /auth/register
router.get('/constituencies', findAllConstituenciesController)
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
router.post('/constituencies', async (req, res) => {
    const newEvent  = req.body;
    console.log('New Constituency:', newEvent.number);
    res.json(await addConstituency(newEvent.number,newEvent.provinceId));
});
router.delete('/constituencies/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    // Implement delete logic here
    console.log(`Deleting constituency with id: ${id}`);
    res.json(await deleteConstituency(id));
});
router.put('/constituencies/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedEvent  = req.body;
    // Implement update logic here
    console.log(`Updating constituency with id: ${id}`, updatedEvent);
    res.json(await editConstituency(id,updatedEvent.number,updatedEvent.provinceId,updatedEvent.isClosed));
});



export default router
