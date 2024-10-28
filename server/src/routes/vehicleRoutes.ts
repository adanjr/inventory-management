import { Router } from "express";
import { 
    getVehicles, 
    getVehicleSummaryByModelAndColor,
    getVehiclesByLocation,
    createVehicle, 
    createVehicleFromCSV,
    getVehicleById, 
    updateVehicle, 
    deleteVehicle, 
    getVehiclesByLocationModelColorStatus
} from '../controllers/vehicleController';

const router = Router();

router.get("/", getVehicles);
router.get("/modelsBySucursal", getVehicleSummaryByModelAndColor);
router.get("/vehiclesByLocation", getVehiclesByLocation);
router.get("/vehiclesForSale", getVehiclesByLocationModelColorStatus);
router.post("/", createVehicle);
router.post("/csv", createVehicleFromCSV);
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
