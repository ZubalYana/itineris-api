import { Router } from "express";
import { CreateInvite, DeclineInvite, AcceptInvite } from "./inviteController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireTripRole } from "../../middleware/roleMiddleware.js";

const router = Router();

router.post('/:tripId', authMiddleware, async (req,res)=>{
    const tripId = req.params.tripId as string;
    const userId = req.user?.id as string;
    const userEmail = req.user?.email as string;

    const result = await CreateInvite(req.body, userId, tripId, userEmail)

    if('error' in result){
        return res.status(400).json(result);
    }

    res.status(201).json(result)
})

router.delete('/', authMiddleware, async (req,res)=>{
    const {token} = req.body;
    const result = await DeclineInvite(token);

    if('error' in result){
        return res.status(400).json(result);
    }

    res.status(200).json(result)
})

router.post('/', authMiddleware, requireTripRole(["OWNER"]), async (req, res)=>{
    const userId = req.user?.id as string;
    const userEmail = req.user?.email as string;
    const {token} = req.body;
    const result = await AcceptInvite(token, userId, userEmail)

    if('error' in result){
        return res.status(400).json(result);
    }

    return res.status(200).json(result)
})

export default router;