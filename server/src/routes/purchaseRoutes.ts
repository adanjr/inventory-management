import { Router } from "express";
import {
    getPurchases,
    createPurchase,
    getPurchaseById,
    updatePurchase,
    deletePurchase
} from '../controllers/purchaseController';

const router = Router();

router.get("/", getPurchases);
router.post("/", createPurchase);
router.get("/:id", getPurchaseById);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
