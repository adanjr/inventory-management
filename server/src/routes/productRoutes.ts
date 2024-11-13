import { Router } from "express";
import { createProduct, 
         getProductById,
         updateProduct, 
         deleteProduct,
         getProducts,
         getProductsByLocation } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/productsByLocation", getProductsByLocation);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/:id", deleteProduct);

export default router;