import { Router } from "express";
import { 
    getBatteryWarranties, 
    createBatteryWarranty, 
    getBatteryWarrantyById, 
    updateBatteryWarranty, 
    deleteBatteryWarranty 
  } from '../controllers/batteryWarrantyController';

const router = Router();

router.get("/", getBatteryWarranties);
router.post("/", createBatteryWarranty);
router.get("/:id", getBatteryWarrantyById);
router.put("/:id", updateBatteryWarranty);
router.delete("/:id", deleteBatteryWarranty);

export default router;