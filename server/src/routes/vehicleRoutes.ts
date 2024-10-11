import { Router } from "express";
import { 
    getVehicles, 
    createVehicle, 
    createVehicleFromCSV,
    getVehicleById, 
    updateVehicle, 
    deleteVehicle 
} from '../controllers/vehicleController';

const router = Router();

router.get("/", getVehicles);
router.post("/", createVehicle);
router.post("/csv", createVehicleFromCSV);
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
