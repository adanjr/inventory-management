import { Router } from "express";
import { 
    getFamilies, 
    createFamily, 
    getFamilyById, 
    updateFamily, 
    deleteFamily 
} from '../controllers/familyController';

const router = Router();

router.get("/", getFamilies);
router.post("/", createFamily);
router.get("/:id", getFamilyById);
router.put("/:id", updateFamily);
router.delete("/:id", deleteFamily);

export default router;
