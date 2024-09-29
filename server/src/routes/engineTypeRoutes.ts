import { Router } from "express";
import { 
    getEngineTypes, 
    createEngineType, 
    getEngineTypeById, 
    updateEngineType, 
    deleteEngineType 
} from '../controllers/engineTypeController';

const router = Router();

router.get("/", getEngineTypes);
router.post("/", createEngineType);
router.get("/:id", getEngineTypeById);
router.put("/:id", updateEngineType);
router.delete("/:id", deleteEngineType);

export default router;
