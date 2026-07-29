import { Router } from "express";
import { CreateTrip, UpdateTrip, DeleteTrip, GetTripById } from "./tripController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireTripRole } from "../../middleware/roleMiddleware.js";
const router = Router();

router.post('/', authMiddleware, async (req, res)=>{
    const userId = req.user?.id;
    const result = await CreateTrip(req.body, String(userId));

    if('error' in result){return res.status(400).json(result)}
    res.status(201).json(result);
});

router.get('/:tripId', authMiddleware, requireTripRole(["OWNER", "COLLABORATOR"]), async (req,res)=>{
    const tripId = req.params.tripId as string;
    const result = await GetTripById(tripId);

    if('error' in result){return res.status(400).json(result)}
    res.status(200).json(result);
})

router.patch('/:tripId', authMiddleware, requireTripRole(['OWNER']), async (req,res)=>{
    const tripId = req.params.tripId as string;

    const result = await UpdateTrip(req.body, tripId) 

    if('error' in result){return res.status(400).json(result)}
    res.status(200).json(result);
})

router.delete('/:tripId', authMiddleware, requireTripRole(['OWNER']), async (req, res)=>{
    const tripId = req.params.tripId as string;

    const result = await DeleteTrip(tripId);
    if('error' in result){return res.status(400).json(result)}
    res.status(200).json(result);
})

export default router;