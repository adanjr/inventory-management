import { Router } from "express";
import { 
    getManufacturers, 
    createManufacturer, 
    getManufacturerById, 
    updateManufacturer, 
    deleteManufacturer 
  } from '../controllers/manufacturerController';

const router = Router();

router.get("/", getManufacturers);
router.post("/", createManufacturer);
router.get("/:id", getManufacturerById);
router.put("/:id", updateManufacturer);
router.delete("/:id", deleteManufacturer);

export default router;