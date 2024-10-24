import { Request, Response } from "express";
import PDFDocument from "pdfkit"; 
import { PrismaClient } from "@prisma/client";

import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const prisma = new PrismaClient();



export const generateDownloadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { format } = require('date-fns');
    const { es } = require('date-fns/locale');

    // Busca la venta por ID
    const sale = await prisma.sales.findUnique({
      where: { saleId: Number(id) },
      include: {
        customer: true,
        location: true,
        saleDetails: {
          include: {
            product: true,
            vehicle: {
              include: {
                model: { include: { make: true, family: true, vehicleType: true } },
                color: true,
                condition: true,
                availabilityStatus: true,
                status: true,
                warranty: true,
                batteryWarranty: true,
              },
            },
          },
        },
      },
    });

    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: Number(1) },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Importar `node-fetch` dinámicamente
    const fetch = (await import('node-fetch')).default;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({
      size: 'A4', // Tamaño de la página
      margin: 0,  // Establece los márgenes de la página
    });

    // Establecer los encabezados para la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="nota-venta-${id}.pdf"`);

    // Pipe del documento PDF a la respuesta
    doc.pipe(res);

    // Agregar una imagen desde una URL (membrete)
    const logoUrl = "https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/Logo_200X200.png";  
    const response = await fetch(logoUrl);
    const imageBuffer = await response.arrayBuffer();

    // Insertar la imagen en la parte superior izquierda (logo más grande)
    doc.image(imageBuffer, 52, -20, { width: 170 }); // Ajusta el ancho del logo a 150

    // Título del PDF (Nota de Venta)
    doc.font('Helvetica-Bold').fontSize(16) 
       .text('NOTA DE VENTA', 54, 150); // Debajo del logo (ajusta la posición según se necesite)

    // Agregar detalles de la venta
    doc.font('Helvetica').fontSize(9)
    .text(`${sale.customer?.name || ""} ${sale.customer?.lastname || ""}`, 54, 180);
    doc.text(`${sale.customer?.postalCode || ""}`, 54, 192);
    doc.text(`${sale.customer?.email || ""}`, 54, 204);
    doc.text(`${sale.customer?.phone || ""}`, 54, 216);

    doc.font('Helvetica-Bold').fontSize(9) 
       .text(`${organization.name || ""}`, 355, 35);
       
    doc.font('Helvetica').fontSize(9)
    .text(`${organization.address}`, 355, 47)
    .text(`${organization.address2}`, 355, 59)
    .text(`${organization.address}, ${organization.postalCode || ""}`, 355, 71);
    doc.text(`${organization.city || ""}, ${organization.state || ""}`, 355, 83);

    doc.font('Helvetica').fontSize(9)
    .text(`NÚMERO DE LA \nFACTURA:`, 355, 170);
    doc.text(`FECHA DE LA \nFACTURA:`, 355, 194);
    doc.text(`NÚMERO DE PEDIDO:`, 355, 218);
    doc.text(`FECHA DE PEDIDO:`, 355, 230);
    doc.text(`METODO DE PAGO:`, 355, 242);

    const formattedDate = format(sale.timestamp, "MMMM dd, yyyy", { locale: es }).toUpperCase();

    doc.font('Helvetica').fontSize(9)
    .text(`${sale.saleId || ""}`, 460, 170);
    doc.text(`${formattedDate || ""}`, 460, 194);
    doc.text(`${sale.saleId || ""}`, 460, 218);
    doc.text(`${formattedDate   || ""}`, 460, 230);
    doc.text(`${sale.paymentMethod || ""}`, 460, 242);

    // Establece el tamaño de la fuente y crea el encabezado
    const headerHeight = 25;
    const columnWidth = 500;

    // Dibuja el encabezado
    doc.rect(50, 330, columnWidth, headerHeight).fillColor('black').fill(); // Encabezado fondo negro

    // Añadir texto del encabezado
    doc.fillColor('white').font('Helvetica-Bold').fontSize(9)
      .text('PRODUCTO', 55, 330 + 10, { width: columnWidth, align: 'left' })
      .text('CANTIDAD', 350, 330 + 10, { width: columnWidth, align: 'left' })
      .text('PRECIO', 450, 330 + 10, { width: columnWidth, align: 'left' });

    // Dibuja una línea debajo del encabezado
    doc.strokeColor('gray').lineWidth(1).moveTo(50, 450).lineTo(550, 450).stroke();

    // Inicializa la posición para los detalles de la tabla
    let yPosition = 365;

    // Añadir los detalles de la venta
    sale.saleDetails.forEach(detail => {
      doc.fillColor('black').font('Helvetica').fontSize(9)
        .text(`${detail.vehicle?.model.vehicleType.name} ${detail.vehicle?.model.name || ''} ${detail.vehicle?.color.name}`, 55, yPosition, { width: columnWidth, align: 'left' })
        .text(detail.quantity.toString(), 350, yPosition, { width: columnWidth, align: 'left' })
        .text(`${detail.unitPrice.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, yPosition, { width: columnWidth, align: 'left' })
        .text(`NO. SERIAL: ${detail.vehicle?.internal_serial}`, 55, yPosition + 12, { width: columnWidth, align: 'left' })
        .text(`NO. MOTOR: ${detail.vehicle?.engineNumber}`, 55, yPosition + 24, { width: columnWidth, align: 'left' });
        
      doc.fillColor('black').font('Helvetica').fontSize(7)
        .text(`COLOR: ${detail.vehicle?.color.name}`, 60, yPosition + 35, { width: columnWidth, align: 'left' })
        .text(`RECIBE TU E-BIKE ARMADA Y LISTA PARA LAS CALLES (GRATIS): ARMADO Y`,60, yPosition + 45, { width: columnWidth, align: 'left' })
        .text(`CONFIGURADO (+$0.00)`, 60, yPosition + 55, { width: columnWidth, align: 'left' });

      yPosition += 20; // Ajusta la altura entre filas
    });

    doc.strokeColor('gray').lineWidth(1).moveTo(355, 470).lineTo(550, 470).stroke();
    doc.strokeColor('gray').lineWidth(1).moveTo(355, 490).lineTo(550, 490).stroke();
    doc.strokeColor('black').lineWidth(1).moveTo(355, 510).lineTo(550, 510).stroke();
    doc.strokeColor('black').lineWidth(1).moveTo(355, 530).lineTo(550, 530).stroke();

    doc.font('Helvetica-Bold').fontSize(9)
    .text(`SUBTOTAL`, 355, 480);
    doc.text(`ENVÍO`, 355, 500);
    doc.text(`TOTAL`, 355, 520);    

    doc.font('Helvetica').fontSize(9)
    .text(`${sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, 480);
    doc.text(`RECOGER EN TIENDA`, 450, 500);
    doc.font('Helvetica-Bold').fontSize(9).text(`${sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, 520);

    doc.strokeColor('gray').lineWidth(1).moveTo(50, 730).lineTo(550, 730).stroke();  

    doc.font('Helvetica').fontSize(9)
      .text('PAGO COMPLETADO', 250, 740, { width: columnWidth, align: 'left' });

    // Finalizar el documento
    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).json({ message: 'Error al generar el PDF' });
  }
};

export const generateSendPdf = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // ID de la venta para la generación del PDF

  const { format } = require('date-fns');
  const { es } = require('date-fns/locale');

  dotenv.config();

  try {
    // Buscar la venta en la base de datos
    const sale = await prisma.sales.findUnique({
      where: { saleId: Number(id) },
      include: {
        customer: true,
        location: true,
        saleDetails: {
          include: {
            product: true,
            vehicle: {
              include: {
                model: { include: { make: true, family: true, vehicleType: true } },
                color: true,
                condition: true,
                availabilityStatus: true,
                status: true,
                warranty: true,
                batteryWarranty: true,
              },
            },
          },
        },
      },
    });

    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: Number(1) },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }
    
    const to = sale.customer!.email;
    const subject = "¡Gracias por su compra!";
    const text = "Agradecemos su compra en nuestra tienda. Pronto estará recibiendo más detalles.";

    // Crear el PDF en memoria
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const pdfChunks: any[] = [];

    const port = Number(process.env.EMAIL_PORT) || 3001;
    const host = process.env.EMAIL_HOST;
    
    // Almacenar el PDF en un buffer
    doc.on('data', (chunk) => pdfChunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(pdfChunks);

      // Configurar Nodemailer
      const transporter = nodemailer.createTransport({
        host: host, // Servidor de correo saliente (SMTP)
        port: port,
        secure: true, // Utilizar SSL
        auth: {
          user: process.env.EMAIL_USER, // Nombre de usuario
          pass: process.env.EMAIL_PASS, // Contraseña
        },
        tls: {
          rejectUnauthorized: false, // Opción para aceptar certificados autofirmados
        },
      });

      // Enviar el correo con el PDF adjunto
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: [
          {
            filename: `nota-venta-${id}.pdf`,
            content: pdfBuffer, // El contenido del PDF como Buffer
            contentType: 'application/pdf',
          },
        ],
      }).then(() => {
        res.status(200).json({ message: 'Correo enviado con éxito' });
      }).catch((error) => {
        console.error('Error enviando correo:', error);
        res.status(500).json({ message: 'Error enviando el correo', error });
      });
    });

    const logoUrl = "https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/Logo_200X200.png";  
    const response = await fetch(logoUrl);
    const imageBuffer = await response.arrayBuffer();

    // Insertar la imagen en la parte superior izquierda (logo más grande)
    doc.image(imageBuffer, 52, -20, { width: 170 }); // Ajusta el ancho del logo a 150

    // Título del PDF (Nota de Venta)
    doc.font('Helvetica-Bold').fontSize(16) 
       .text('NOTA DE VENTA', 54, 150); // Debajo del logo (ajusta la posición según se necesite)

    // Agregar detalles de la venta
    doc.font('Helvetica').fontSize(9)
    .text(`${sale.customer?.name || ""} ${sale.customer?.lastname || ""}`, 54, 180);
    doc.text(`${sale.customer?.postalCode || ""}`, 54, 192);
    doc.text(`${sale.customer?.email || ""}`, 54, 204);
    doc.text(`${sale.customer?.phone || ""}`, 54, 216);

    doc.font('Helvetica-Bold').fontSize(9) 
       .text(`${organization.name || ""}`, 355, 35);
       
    doc.font('Helvetica').fontSize(9)
    .text(`${organization.address}`, 355, 47)
    .text(`${organization.address2}`, 355, 59)
    .text(`${organization.address}, ${organization.postalCode || ""}`, 355, 71);
    doc.text(`${organization.city || ""}, ${organization.state || ""}`, 355, 83);

    doc.font('Helvetica').fontSize(9)
    .text(`NÚMERO DE LA \nFACTURA:`, 355, 170);
    doc.text(`FECHA DE LA \nFACTURA:`, 355, 194);
    doc.text(`NÚMERO DE PEDIDO:`, 355, 218);
    doc.text(`FECHA DE PEDIDO:`, 355, 230);
    doc.text(`METODO DE PAGO:`, 355, 242);

    const formattedDate = format(sale.timestamp, "MMMM dd, yyyy", { locale: es }).toUpperCase();

    doc.font('Helvetica').fontSize(9)
    .text(`${sale.saleId || ""}`, 460, 170);
    doc.text(`${formattedDate || ""}`, 460, 194);
    doc.text(`${sale.saleId || ""}`, 460, 218);
    doc.text(`${formattedDate   || ""}`, 460, 230);
    doc.text(`${sale.paymentMethod || ""}`, 460, 242);

    // Establece el tamaño de la fuente y crea el encabezado
    const headerHeight = 25;
    const columnWidth = 500;

    // Dibuja el encabezado
    doc.rect(50, 330, columnWidth, headerHeight).fillColor('black').fill(); // Encabezado fondo negro

    // Añadir texto del encabezado
    doc.fillColor('white').font('Helvetica-Bold').fontSize(9)
      .text('PRODUCTO', 55, 330 + 10, { width: columnWidth, align: 'left' })
      .text('CANTIDAD', 350, 330 + 10, { width: columnWidth, align: 'left' })
      .text('PRECIO', 450, 330 + 10, { width: columnWidth, align: 'left' });

    // Dibuja una línea debajo del encabezado
    doc.strokeColor('gray').lineWidth(1).moveTo(50, 450).lineTo(550, 450).stroke();

    // Inicializa la posición para los detalles de la tabla
    let yPosition = 365;

    // Añadir los detalles de la venta
    sale.saleDetails.forEach(detail => {
      doc.fillColor('black').font('Helvetica').fontSize(9)
        .text(`${detail.vehicle?.model.vehicleType.name} ${detail.vehicle?.model.name || ''} ${detail.vehicle?.color.name}`, 55, yPosition, { width: columnWidth, align: 'left' })
        .text(detail.quantity.toString(), 350, yPosition, { width: columnWidth, align: 'left' })
        .text(`${detail.unitPrice.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, yPosition, { width: columnWidth, align: 'left' })
        .text(`NO. SERIAL: ${detail.vehicle?.internal_serial}`, 55, yPosition + 12, { width: columnWidth, align: 'left' })
        .text(`NO. MOTOR: ${detail.vehicle?.engineNumber}`, 55, yPosition + 24, { width: columnWidth, align: 'left' });
        
      doc.fillColor('black').font('Helvetica').fontSize(7)
        .text(`COLOR: ${detail.vehicle?.color.name}`, 60, yPosition + 35, { width: columnWidth, align: 'left' })
        .text(`RECIBE TU E-BIKE ARMADA Y LISTA PARA LAS CALLES (GRATIS): ARMADO Y`,60, yPosition + 45, { width: columnWidth, align: 'left' })
        .text(`CONFIGURADO (+$0.00)`, 60, yPosition + 55, { width: columnWidth, align: 'left' });

      yPosition += 20; // Ajusta la altura entre filas
    });

    doc.strokeColor('gray').lineWidth(1).moveTo(355, 470).lineTo(550, 470).stroke();
    doc.strokeColor('gray').lineWidth(1).moveTo(355, 490).lineTo(550, 490).stroke();
    doc.strokeColor('black').lineWidth(1).moveTo(355, 510).lineTo(550, 510).stroke();
    doc.strokeColor('black').lineWidth(1).moveTo(355, 530).lineTo(550, 530).stroke();

    doc.font('Helvetica-Bold').fontSize(9)
    .text(`SUBTOTAL`, 355, 480);
    doc.text(`ENVÍO`, 355, 500);
    doc.text(`TOTAL`, 355, 520);    

    doc.font('Helvetica').fontSize(9)
    .text(`${sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, 480);
    doc.text(`RECOGER EN TIENDA`, 450, 500);
    doc.font('Helvetica-Bold').fontSize(9).text(`${sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, 450, 520);

    doc.strokeColor('gray').lineWidth(1).moveTo(50, 730).lineTo(550, 730).stroke();  

    doc.font('Helvetica').fontSize(9)
      .text('PAGO COMPLETADO', 250, 740, { width: columnWidth, align: 'left' });

    doc.end(); // Finaliza la creación del PDF
  } catch (error) {
    console.error('Error al generar el PDF y enviar el correo:', error);
    res.status(500).json({ message: 'Error al generar el PDF y enviar el correo', error });
  }
};