import { Router } from "express";
import { 
    getFuelTypes, 
    createFuelType, 
    getFuelTypeById, 
    updateFuelType, 
    deleteFuelType 
} from '../controllers/fuelTypeController';

const router = Router();

router.get("/", getFuelTypes);
router.post("/", createFuelType);
router.get("/:id", getFuelTypeById);
router.put("/:id", updateFuelType);
router.delete("/:id", deleteFuelType);

export default router;
