import { CreatePlace, UpdatePlace, DeletePlace, GetAllByTrip, GetById } from "./placeController.js";
import {Router} from 'express';
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireTripRole } from "../../middleware/roleMiddleware.js";
const router = Router();

router.post('/:tripId',authMiddleware, requireTripRole(['OWNER', 'COLLABORATOR']), async (req,res)=>{
    const tripId = req.params.tripId as string;
    const result = await CreatePlace(req.body, tripId)
    if('error' in result ) { 
        return res.status(400).json(result) 
    }
    res.status(201).json(result);
});

router.patch('/:tripId/:placeId', authMiddleware, requireTripRole(['OWNER', 'COLLABORATOR']), async (req,res)=>{
    const tripId = req.params.tripId as string;
    const placeId = req.params.placeId as string;
    const result = await UpdatePlace(req.body, placeId, tripId);
    if('error' in result){
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.delete('/:tripId/:placeId',authMiddleware, requireTripRole(['OWNER', 'COLLABORATOR']),  async (req,res)=>{
    const tripId = req.params.tripId as string;
    const placeId = req.params.placeId as string;
    const result = await DeletePlace(placeId, tripId);
    if('error' in result){
        return res.status(400).json(result)
    } 
    res.status(200).json(result);
})

// router.get('/:placeId', async (req,res)=>{
//     const placeId = req.params.placeId as string;
//     const result = await GetById(placeId);
//     if('error' in result){
//         return res.status(400).json(result)
//     }
//     res.status(200).json(result);
// })

router.get('/trip/:tripId',authMiddleware, requireTripRole(['OWNER', 'COLLABORATOR']),  async (req,res)=>{
    const tripId = req.params.tripId as string;
    const result = await GetAllByTrip(tripId);
    if('error' in result){
        return res.status(400).json(result)
    }
    res.status(200).json(result);
})

export default router;