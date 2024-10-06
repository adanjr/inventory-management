import { Router } from "express";
import { 
    getVehicleConditions, 
    createVehicleCondition, 
    getVehicleConditionById, 
    updateVehicleCondition, 
    deleteVehicleCondition 
  } from '../controllers/vehicleConditionsController';

const router = Router();

router.get("/", getVehicleConditions);
router.post("/", createVehicleCondition);
router.get("/:id", getVehicleConditionById);
router.put("/:id", updateVehicleCondition);
router.delete("/:id", deleteVehicleCondition);

export default router;