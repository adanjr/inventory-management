import { Router } from "express";
import { 
  getRoles, 
  getRole, 
  createRole, 
  updateRole, 
  deleteRole, 
  getRolePermissionsByName,
  getRolePermissionsByModule
} from "../controllers/roleController";

const router = Router();

router.get("/", getRoles);
router.get("/:roleId", getRole);
router.get("/getPermissionsByName/:roleId", getRolePermissionsByName);
router.get("/getPermissionsByModule/:roleId", getRolePermissionsByModule);
router.post("/", createRole);
router.put("/:roleId", updateRole);
router.delete("/:roleId", deleteRole);

export default router;
