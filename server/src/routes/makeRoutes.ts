import { Router } from "express";
import { 
    getMakes, 
    createMake, 
    getMakeById, 
    updateMake, 
    deleteMake 
} from '../controllers/makeController';

const router = Router();

router.get("/", getMakes);
router.post("/", createMake);
router.get("/:id", getMakeById);
router.put("/:id", updateMake);
router.delete("/:id", deleteMake);

export default router;
