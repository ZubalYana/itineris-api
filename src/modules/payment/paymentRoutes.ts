import { Router } from "express";
import { CreateContribution, ListPaymentsByTrip, HandleWebhook } from "./paymentController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireTripRole } from "../../middleware/roleMiddleware.js";

const router = Router();

router.post('/:tripId', authMiddleware, requireTripRole(["OWNER", "COLLABORATOR"]), async (req, res) => {
  const tripId = req.params.tripId as string;
  const userId = req.user?.id as string;

  const result = await CreateContribution(req.body, userId, tripId);

  if ('error' in result) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
});

router.get('/:tripId', authMiddleware, requireTripRole(["OWNER", "COLLABORATOR"]), async (req, res) => {
  const tripId = req.params.tripId as string;

  const result = await ListPaymentsByTrip(tripId);

  if ('error' in result) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

export default router;