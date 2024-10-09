// routes/inventoryRoutes.ts

import { Router } from "express";
import { getVehiclesCountByLocation,
         getVehicleCountsGrouped
 } from '../controllers/inventoryController';

const router = Router();

// Ruta para obtener el total de vehículos por sucursal
router.get("/counts", getVehiclesCountByLocation);
router.get("/count-by-model-color-status", getVehicleCountsGrouped); // Ahora acepta locationId como query param

export default router;
