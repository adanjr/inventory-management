import { Router } from "express";
import { 
    getVehicleInventoryLocations, 
    createVehicleInventoryLocation, 
    getVehicleInventoryLocationById, 
    updateVehicleInventoryLocation, 
    deleteVehicleInventoryLocation 
  } from '../controllers/vehicleInventoryLocationsController';

const router = Router();

router.get("/", getVehicleInventoryLocations);
router.post("/", createVehicleInventoryLocation);
router.get("/:id", getVehicleInventoryLocationById);
router.put("/:id", updateVehicleInventoryLocation);
router.delete("/:id", deleteVehicleInventoryLocation);

export default router;