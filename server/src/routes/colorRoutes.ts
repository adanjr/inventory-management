import { Router } from "express";
import { 
    getColors, 
    createColor, 
    getColorById, 
    updateColor, 
    deleteColor 
} from '../controllers/colorController';

const router = Router();

router.get("/", getColors);
router.post("/", createColor);
router.get("/:id", getColorById);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);

export default router;
