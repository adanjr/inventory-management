import { Router } from "express";
import { 
    getVehicleAvailabilityStatuses, 
    createVehicleAvailabilityStatus, 
    getVehicleAvailabilityStatusById, 
    updateVehicleAvailabilityStatus, 
    deleteVehicleAvailabilityStatus 
  } from '../controllers/VehicleAvailabilityStatusController';

const router = Router();

router.get("/", getVehicleAvailabilityStatuses);
router.post("/", createVehicleAvailabilityStatus);
router.get("/:id", getVehicleAvailabilityStatusById);
router.put("/:id", updateVehicleAvailabilityStatus);
router.delete("/:id", deleteVehicleAvailabilityStatus);

export default router;