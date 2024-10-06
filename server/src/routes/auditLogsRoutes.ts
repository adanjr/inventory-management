import { Router } from "express";
import { 
    getAuditLogs, 
    createAuditLog, 
    getAuditLogById, 
    updateAuditLog, 
    deleteAuditLog 
  } from '../controllers/auditLogsController';

const router = Router();

router.get("/", getAuditLogs);
router.post("/", createAuditLog);
router.get("/:id", getAuditLogById);
router.put("/:id", updateAuditLog);
router.delete("/:id", deleteAuditLog);

export default router;