import { Router } from "express";
import { 
    getVehicleTypes, 
    createVehicleType, 
    getVehicleTypeById, 
    updateVehicleType, 
    deleteVehicleType 
} from '../controllers/vehicleTypeController';

const router = Router();

router.get("/", getVehicleTypes);
router.post("/", createVehicleType);
router.get("/:id", getVehicleTypeById);
router.put("/:id", updateVehicleType);
router.delete("/:id", deleteVehicleType);

export default router;
