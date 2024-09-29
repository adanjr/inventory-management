import { Router } from "express";
import { 
    getVehicleStatuses, 
    createVehicleStatus, 
    getVehicleStatusById, 
    updateVehicleStatus, 
    deleteVehicleStatus 
} from '../controllers/vehicleStatusController';

const router = Router();

router.get("/", getVehicleStatuses);
router.post("/", createVehicleStatus);
router.get("/:id", getVehicleStatusById);
router.put("/:id", updateVehicleStatus);
router.delete("/:id", deleteVehicleStatus);

export default router;
