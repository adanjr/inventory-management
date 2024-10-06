import { Router } from "express";
import { 
    getWarranties, 
    createWarranty, 
    getWarrantyById, 
    updateWarranty, 
    deleteWarranty 
  } from '../controllers/warrantyController';

const router = Router();

router.get("/", getWarranties);
router.post("/", createWarranty);
router.get("/:id", getWarrantyById);
router.put("/:id", updateWarranty);
router.delete("/:id", deleteWarranty);

export default router;