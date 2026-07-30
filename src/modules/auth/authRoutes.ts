import { Register, Login, VerifyEmail, ConfirmEmail, ForgotPassword, ResetPassword } from "./authController.js";
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

router.post('/confirm-email/:token', async (req, res) => {
  const token = req.params.token as string;
  if (!token) return res.status(400).json({ message: 'Token not found' });

  const result = await ConfirmEmail(token);
  if ('error' in result) {
    res.status(400).json(result);
    return;
  }
  res.status(200).json(result);
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const result = await ForgotPassword(email);
  res.status(200).json(result);
})

router.post('/reset-password/:token', async (req,res)=>{
    const token = req.params.token as string;
    const {newPassword} = req.body;
    if (!token) return res.status(400).json({ message: 'Internal server error' });
    const result = await ResetPassword(token, newPassword)
    if ('error' in result) {
    res.status(400).json(result);
    return;
  }
  res.status(200).json(result);
})

export default router;