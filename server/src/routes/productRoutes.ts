import { Router } from "express";
import { createProduct, updateProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/", updateProduct);

export default router;