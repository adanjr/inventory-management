import { Router } from "express";
import { 
    getAuditTypes, 
    createAuditType, 
    getAuditTypeById, 
    updateAuditType, 
    deleteAuditType 
  } from '../controllers/auditTypesController';

const router = Router();

router.get("/", getAuditTypes);
router.post("/", createAuditType);
router.get("/:id", getAuditTypeById);
router.put("/:id", updateAuditType);
router.delete("/:id", deleteAuditType);

export default router;