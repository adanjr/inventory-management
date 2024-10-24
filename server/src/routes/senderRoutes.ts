import { Router } from "express";
import { sendEmail } from "../controllers/senderController";
 
const router = Router();

// Ruta para enviar el correo
router.post('/', sendEmail);

export default router;
