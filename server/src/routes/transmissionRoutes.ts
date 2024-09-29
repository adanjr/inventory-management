import { Router } from "express";
import { 
    getTransmissions, 
    createTransmission, 
    getTransmissionById, 
    updateTransmission, 
    deleteTransmission 
} from '../controllers/transmissionController';

const router = Router();

router.get("/", getTransmissions);
router.post("/", createTransmission);
router.get("/:id", getTransmissionById);
router.put("/:id", updateTransmission);
router.delete("/:id", deleteTransmission);

export default router;
