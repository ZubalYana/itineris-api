import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';
import type { ReqUser } from '../types/express.js';

export default function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        res.status(401).json({message: 'Unauthenticated'});
        return
    }

    try{

    const decoded = jwt.verify(token, env.JWT_SECRET) as ReqUser;
    req.user = {id: decoded.id, email: decoded.email }
    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}