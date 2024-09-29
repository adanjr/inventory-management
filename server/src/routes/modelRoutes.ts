import { Router } from "express";
import { 
    getModels, 
    createModel, 
    getModelById, 
    updateModel, 
    deleteModel 
} from '../controllers/modelController';

const router = Router();

router.get("/", getModels);
router.post("/", createModel);
router.get("/:id", getModelById);
router.put("/:id", updateModel);
router.delete("/:id", deleteModel);

export default router;
