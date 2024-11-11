import { Request, Response } from "express";
import PDFDocument from "pdfkit"; 
import { PrismaClient, SaleDetails } from "@prisma/client";

import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const prisma = new PrismaClient();

interface SaleDetail {
  productName: string; // Asumo que necesitas el nombre del producto
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

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
    res.setHeader('Content-Disposition', `attachment; filename="factura-venta-${sale.noteNumber}.pdf"`);

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
    .text(`${sale.noteNumber || ""}`, 460, 170);
    doc.text(`${formattedDate || ""}`, 460, 194);
    doc.text(`${sale.noteNumber || ""}`, 460, 218);
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
    doc.text(`${sale.deliveryMethod || ""}`, 450, 500);
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

    const formattedDate = format(sale.timestamp, "MMMM dd, yyyy", { locale: es }).toUpperCase();
    const fullName = `${sale.customer?.name} ${sale.customer?.lastname}` || '';
    const deliveryMethodToMail = sale.deliveryMethod || '';
    const paymentMethodToMail = sale.paymentMethod || '';
    const subtotalParaMail= sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    const totalParaMail= sale.totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    
    const saleDetailsArray: SaleDetail[] = sale.saleDetails.map(detail => {
      // Construimos el nombre del producto con el formato deseado
      const productName = `${detail.vehicle?.model.vehicleType.name} ${detail.vehicle?.model.name || ''} - ${detail.vehicle?.color.name}`;
    
      // Obtenemos la cantidad, el precio unitario y calculamos el subtotal
      const quantity = detail.quantity;
      const unitPrice = detail.unitPrice;
      const subtotal = detail.subtotal;
    
      return {
        productName,
        quantity,
        unitPrice,
        subtotal,
      };
    });

    const to = sale.customer?.email || organization?.email || '';
    const subject = "¡Gracias por tu compra!";
    const text = "Agradecemos su compra en nuestra tienda. Pronto estará recibiendo más detalles.";
    const html = generateMailTemplate(fullName,formattedDate, formattedDate,saleDetailsArray,subtotalParaMail,deliveryMethodToMail,paymentMethodToMail,totalParaMail);

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
        //from: process.env.EMAIL_USER,
        from: `YAII MOTORS Sucursal Terraza Oblatos <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
        attachments: [
          {
            filename: `factura-venta-${sale.noteNumber}.pdf`,
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
    doc.text(`${sale.customer?.email || "Sin Email"}`, 54, 204);
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

    doc.font('Helvetica').fontSize(9)
    .text(`${sale.noteNumber || ""}`, 460, 170);
    doc.text(`${formattedDate || ""}`, 460, 194);
    doc.text(`${sale.noteNumber || ""}`, 460, 218);
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
    doc.text(`${sale.deliveryMethod || ""}`, 450, 500);
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

function generateMailTemplate(customerName: string, 
  orderNumber: string, 
  fecha: string,
  saleDetails: SaleDetail[],
  subTotal: string,
  deliveryMethod: string,
  paymentMethod: string,
  totalAmount: string
) {

  const saleDetailsRows = saleDetails
    .map(
      (detail) => `
      <tr>
        <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:left;color:rgb(51,51,51)">${detail.productName}</td>
        <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:left;color:rgb(51,51,51)">${detail.quantity}</td>
        <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51)">$${detail.unitPrice.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `<div marginwidth="0" marginheight="0" style="padding:0; text-align:left; background-color: #ffffff;" bgcolor="#fff">
    <table width="100%" id="outer_wrapper" style="background-color:#ffffff; margin:0; padding:0;" bgcolor="#fff">
        <tbody>
            <tr>
                <td align="center">
                    <table width="600" style="max-width:600px; margin:0 auto; padding:0;">
                        <tbody>
                            <tr>
                                <td align="center" valign="top">
                                        <div id="template_header_image">
                                            <p style="margin-top:0px">
                                                <img src="https://yiwualliance.com.mx/wp-content/uploads/2024/07/mail.jpg" alt="YIWU Alliance" style="border: medium; display: inline-block; font-size: 14px; font-weight: bold; height: auto; outline: currentcolor; text-decoration: none; text-transform: capitalize; vertical-align: middle; max-width: 100%; margin-left: 0px; margin-right: 0px;" border="0">
                                            </p>
                                        </div>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_container" style="border:1px solid rgb(229,229,229);border-radius:3px;background-color:rgb(255,255,255)" bgcolor="#fff">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header" style="border-bottom-width:0px;border-bottom-style:none;font-weight:bold;line-height:100%;vertical-align:middle;font-family:Helvetica,Roboto,Arial,sans-serif;border-radius:3px 3px 0px 0px;background-color:rgb(0,0,0);border-bottom-color:currentcolor;color:rgb(255,255,255)" bgcolor="#000">
                                                            <tbody>
                                                                <tr>
                                                                    <td id="header_wrapper" style="padding:36px 48px;display:block;">
                                                                        <h1 style="font-size:30px;font-weight:300;line-height:150%;margin:0px;text-align:left;color:rgb(255,255,255)" bgcolor="inherit">YIWU ALLIANCE agradece tu compra</h1>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_body">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" id="body_content" style="background-color:rgb(255,255,255)" bgcolor="#fff">
                                                                        <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" style="padding:48px 48px 32px">
                                                                                        <div id="body_content_inner" style="font-family:Helvetica,Roboto,Arial,sans-serif;font-size:14px;line-height:150%;text-align:left;color:rgb(51,51,51)" align="left">
                                                                                            <p style="margin:0px 0px 16px;">Hola ${customerName},</p>
                                                                                            <p style="margin:0px 0px 16px;">Solo para que lo sepas — hemos recibido tu pedido ${orderNumber}, y ahora se está procesando:</p>
                                                                                            <p style="margin:0px 0px 16px;">
                                                                                                Para pagos en efectivo, es necesario acudir a nuestra tienda física ubicada en “GRAN TERRAZA OBLATOS L-129”.<br>
                                                                                                Para pagos por transferencia, por favor envíe el comprobante de pago a nuestro WhatsApp. Una vez confirmada la recepción del pago, el estatus de su compra se actualizará y se verá reflejado. También puede solicitar más información sobre su envío a través de este canal.<br>
                                                                                                (No se realizarán envíos sin que el producto haya sido completamente pagado en la tienda. Agradecemos su comprensión y preferencia.)
                                                                                            </p>
                                                                                            <h2 style="display:block;font-size:18px;font-weight:bold;line-height:130%;margin:0px 0px 18px;text-align:left;color:rgb(0,0,0)">
                                                                                                [Pedido ${orderNumber}] (${fecha})
                                                                                            </h2>
                                                                                            <div style="margin-bottom:40px;">
                                                                                                <table cellspacing="0" cellpadding="6" border="1" style="border:1px solid rgb(229,229,229);vertical-align:middle;width:100%;color:rgb(51,51,51)" width="100%">
                                                                                                    <thead>
                                                                                                        <tr>
                                                                                                            <th scope="col" style="border:1px solid rgb(229,229,229);vertical-align:middle;padding:12px;text-align:left;color:rgb(51,51,51)" align="left">Producto</th>
                                                                                                            <th scope="col" style="border:1px solid rgb(229,229,229);vertical-align:middle;padding:12px;text-align:left;color:rgb(51,51,51)" align="left">Cantidad</th>
                                                                                                            <th scope="col" style="border:1px solid rgb(229,229,229);vertical-align:middle;padding:12px;text-align:right;color:rgb(51,51,51)" align="right">Precio</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                      <tbody>
                                                                                                        ${saleDetailsRows}
                                                                                                    </tbody>
                                                                                                    <tfoot>
                                                                                                        <tr>
                                                                                                            <td colspan="2" style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">Subtotal:</td>
                                                                                                            <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">${subTotal}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td colspan="2" style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">Envío:</td>
                                                                                                            <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">${deliveryMethod}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td colspan="2" style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">Método de pago:</td>
                                                                                                            <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">${paymentMethod}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td colspan="2" style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">Total:</td>
                                                                                                            <td style="border:1px solid rgb(229,229,229);padding:12px;text-align:right;color:rgb(51,51,51);font-weight:bold">${totalAmount}</td>
                                                                                                        </tr>
                                                                                                    </tfoot>
                                                                                                </table>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;
}