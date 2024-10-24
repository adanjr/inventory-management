import { Request, Response } from "express";

import nodemailer from 'nodemailer';

export const sendEmail = async (req: Request, res: Response): Promise<void> => {

  const { to, subject, text } = req.body;
  console.log('Llega peticion de mail:',req.body);

  // Configurar Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'mail.yiwualliance.com.mx', // Servidor de correo saliente (SMTP)
    port: 465, // Puerto SMTP recomendado para SSL
    secure: true, // Utilizar SSL
    auth: {
      user: 'terrazaoblatos@yiwualliance.com.mx', // Nombre de usuario de la cuenta
      pass: 'OVDGA!aiyQB-', // Contraseña de la cuenta de correo
    },
    tls: {
      rejectUnauthorized: false, // Opción para aceptar certificados autofirmados
    },
  });

  try {
    // Enviar el correo
    await transporter.sendMail({
      from: 'terrazaoblatos@yiwualliance.com.mx', // El remitente
      to, // El destinatario
      subject, // Asunto
      text, // Mensaje
    });

    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error enviando el correo', error });
  }
};