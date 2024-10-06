import { Router } from "express";
import { 
    getMovements, 
    createMovement, 
    getMovementById, 
    updateMovement, 
    deleteMovement 
  } from '../controllers/movementsController';

const router = Router();

router.get("/", getMovements);
router.post("/", createMovement);
router.get("/:id", getMovementById);
router.put("/:id", updateMovement);
router.delete("/:id", deleteMovement);

export default router;