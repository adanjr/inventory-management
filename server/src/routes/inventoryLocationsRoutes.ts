import { Router } from "express";
import { 
    getInventoryLocations, 
    createInventoryLocation, 
    getInventoryLocationById, 
    updateInventoryLocation, 
    deleteInventoryLocation 
  } from '../controllers/inventoryLocationsController';

const router = Router();

router.get("/", getInventoryLocations);
router.post("/", createInventoryLocation);
router.get("/:id", getInventoryLocationById);
router.put("/:id", updateInventoryLocation);
router.delete("/:id", deleteInventoryLocation);

export default router;