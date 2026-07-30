import { Register, Login, VerifyEmail } from "./authController.js";
import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
const router = Router();

router.post('/register', async (req, res)=>{
    const result = await Register(req.body);
    if('error' in result){
        res.status(400).json(result);
        return;
    }
    res.status(201).json(result);
})

router.post('/login', async (req,res)=>{
    const result = await Login(req.body);
    if('error' in result){
        res.status(400).json(result);
        return
    }
    res.status(200).json(result);
})

router.post('/verify-email', authMiddleware, async (req,res)=>{
    const userEmail = req.user?.email;
    if(!userEmail) return res.status(400).json({message: 'Email to be verified not found'});
    const result = await VerifyEmail(userEmail);

    if('error' in result){
        res.status(400).json(result);
        return;
    }
    res.status(200).json(result)
})

export default router;