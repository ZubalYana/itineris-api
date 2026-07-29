import { Router } from "express";
import { CreateInvite } from "./inviteController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

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

export default router;