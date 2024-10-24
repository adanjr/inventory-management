import express from 'express';
import { generatePdf } from '../controllers/reciboVentaController';
 
const router = express.Router();

// Ruta para generar y enviar el PDF
router.get("/:id", generatePdf);

export default router;
