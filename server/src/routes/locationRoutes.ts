import { Router } from "express";
import { 
    getLocations, 
    getLocationsByUsername,
    createLocation, 
    getLocationById, 
    updateLocation, 
    deleteLocation 
  } from '../controllers/locationController';

const router = Router();

router.get("/", getLocations);
router.get('/byUser/:username', getLocationsByUsername);
router.post("/", createLocation);
router.get("/:id", getLocationById);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;