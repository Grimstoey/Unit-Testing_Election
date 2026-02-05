import { findAllConstituenciesController } from '@/controllers/AdminController'
import { Router } from 'express'
import {addConstituency, getConstituencyById} from "@/repositories/AdminRepository";

const router = Router()

// POST /auth/register
router.get('/constituencies', findAllConstituenciesController)
router.get("/constituencies/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const event = await getConstituencyById(id);
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
export default router
