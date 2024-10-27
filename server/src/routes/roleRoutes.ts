import { Router } from "express";
import { 
  getRoles, 
  getRole, 
  createRole, 
  updateRole, 
  deleteRole 
} from "../controllers/roleController";

const router = Router();

router.get("/", getRoles);
router.get("/:roleId", getRole);
router.post("/", createRole);
router.put("/:roleId", updateRole);
router.delete("/:roleId", deleteRole);

export default router;
