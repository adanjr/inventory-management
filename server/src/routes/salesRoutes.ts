import { Router } from "express";
import {
    getSales,
    createSale,
    getSaleById,
    updateSale,
    deleteSale
} from '../controllers/salesController';

const router = Router();

router.get("/", getSales);
router.post("/", createSale);
router.get("/:id", getSaleById);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
