import { Router } from "express";
import { CreateTrip, UpdateTrip, DeleteTrip, GetTripById, GetMyTrips, UploadBanner } from "./tripController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireTripRole } from "../../middleware/roleMiddleware.js";
import { upload } from "../../config/multer.config.js";
const router = Router();

router.post('/', authMiddleware, async (req, res)=>{
    const userId = req.user?.id;
    const result = await CreateTrip(req.body, String(userId));

    if('error' in result){return res.status(400).json(result)}
    res.status(201).json(result);
});

router.get('/:tripId', authMiddleware, requireTripRole(["OWNER", "COLLABORATOR"]), async (req,res)=>{
    const tripId = req.params.tripId as string;
    const userId = req.user?.id as string;
    const result = await GetTripById(tripId, userId);

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

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { search, sortBy, order } = req.query as {
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  };

  const result = await GetMyTrips(userId, search, sortBy, order);

  if ('error' in result) { res.status(400).json(result); return; }
  res.status(200).json(result);
});

router.patch('/:tripId/banner', authMiddleware, requireTripRole(['OWNER']), upload.single('banner'), async (req,res)=>{
    const tripId = req.params.tripId as string;
    if(!tripId) return res.status(400).json({error: 'Trip not found'})
    const banner = req.file
if(!banner) return res.status(400).json({error: 'Banner not uploaded'})
    const result = await UploadBanner(banner!, tripId)
    return res.status(200).json(result)
} )
export default router;