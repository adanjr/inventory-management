import express from 'express';
import { generateSendPdf, generateDownloadPdf } from '../controllers/reciboVentaController';
 
const router = express.Router();

// Ruta para generar y enviar el PDF
router.get("/:id", generateDownloadPdf );
router.get("/send/:id", generateSendPdf);

export default router;
