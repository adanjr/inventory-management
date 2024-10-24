import { Router } from "express";
import {
  createOrganization,
  updateOrganization,
  getOrganizations,
  getOrganizationById,
  deleteOrganization,
} from "../controllers/organizationController"; // Asegúrate de que la ruta sea correcta

const router = Router();

// Obtener todas las organizaciones
router.get("/", getOrganizations);

// Obtener una organización por ID
router.get("/:organizationId", getOrganizationById);

// Crear una nueva organización
router.post("/", createOrganization);

// Actualizar una organización por ID
router.put("/:organizationId", updateOrganization);

// Eliminar una organización por ID
router.delete("/:organizationId", deleteOrganization);

export default router;
