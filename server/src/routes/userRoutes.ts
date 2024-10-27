import { Router } from "express";
import { getUsers,
         getUser, 
         createUser, 
         updateUser, 
         deleteUser 
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:cognitoId", getUser);
router.post("/", createUser);
router.put("/:cognitoId", updateUser);
router.delete("/:cognitoId", deleteUser);

export default router;