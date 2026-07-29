import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import type { TripRole } from '@prisma/client';

export function requireTripRole(allowedRoles: TripRole[]){
    return async function (req: Request, res: Response, next: NextFunction){
        const userId = req.user?.id;
        const tripId = req.params.tripId as string;

        if(!userId){
            res.status(401).json({message: "Unauthenticated"});
            return
        }

        if(!tripId){
            res.status(400).json({message: 'Trip not found'});
            return;
        }

        const membership = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {tripId, userId}
            }
        })

        if(!membership || !allowedRoles.includes(membership.role)){
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        next()
    }
}