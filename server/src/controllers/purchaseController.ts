import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las órdenes de compra o buscar por referencia o estado
export const getPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const purchases = await prisma.purchases.findMany({
      where: {
        OR: [
          { purchaseOrder: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
          { purchaseStatus: { contains: search, mode: 'insensitive' } }
        ],
      },
      include: {
        supplier: true,
        purchaseDetails: {
          include: {
            product: true,
            model: true,
            color: true,
            vehicles: true,
          },
        },
      },
    });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};

// Obtener una orden de compra por ID
export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const purchase = await prisma.purchases.findUnique({
      where: { purchaseId: Number(id) },
      include: {
        supplier: true,
        purchaseDetails: {
          include: {
            product: true,
            model: true,
            color: true,
            vehicles: true,
          },
        },
      },
    });

    if (!purchase) {
      res.status(404).json({ message: "Purchase not found" });
    } else {
      res.json(purchase);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchase" });
  }
};

// Crear una nueva orden de compra
export const createPurchase = async (req: Request, res: Response): Promise<void> => { 
  try {
    const {
      purchaseOrder,
      reference,
      purchaseDate,
      receiptMethod,
      deliveryEstimate,
      paymentTerm,
      totalPurchase,
      supplierId,
      shipmentPreference,
      termsConditions,
      purchaseStatus,
      notes,
      urlAttachments,
      purchaseDetails,
    } = req.body;

    const purchase = await prisma.purchases.create({
      data: {
        purchaseOrder,
        reference,
        purchaseDate: new Date(purchaseDate),
        receiptMethod,
        deliveryEstimate: new Date(deliveryEstimate),
        paymentTerm,
        totalPurchase,
        supplierId,
        shipmentPreference,
        termsConditions,
        purchaseStatus,
        notes,
        urlAttachments,
        timestamp: new Date(),  // Se agrega el timestamp con la fecha y hora actual
        purchaseDetails: {
          create: purchaseDetails.map((detail: any) => ({
            productId: detail.productId,
            modelId: detail.modelId,
            colorId: detail.colorId,
            serialNumber: detail.serialNumber,
            vehicleId: detail.vehicleId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
            expectedDate: detail.expectedDate ? new Date(detail.expectedDate) : null,
            actualDate: detail.actualDate ? new Date(detail.actualDate) : null,
            receptionStatus: detail.receptionStatus,
            condition: detail.condition,
          })),
        },
      },
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase: " + error });
  }
};

// Actualizar una orden de compra por ID
export const updatePurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      purchaseOrder,
      reference,
      purchaseDate,
      receiptMethod,
      deliveryEstimate,
      paymentTerm,
      totalPurchase,
      supplierId,
      shipmentPreference,
      termsConditions,
      purchaseStatus,
      notes,
      urlAttachments,
      purchaseDetails,
    } = req.body;

    const purchase = await prisma.purchases.update({
      where: { purchaseId: Number(id) },
      data: {
        purchaseOrder,
        reference,
        purchaseDate: new Date(purchaseDate),
        receiptMethod,
        deliveryEstimate: new Date(deliveryEstimate),
        paymentTerm,
        totalPurchase,
        supplierId,
        shipmentPreference,
        termsConditions,
        purchaseStatus,
        notes,
        urlAttachments,
        purchaseDetails: {
          deleteMany: {}, // Eliminar los detalles existentes
          create: purchaseDetails.map((detail: any) => ({
            productId: detail.productId,
            modelId: detail.modelId,
            colorId: detail.colorId,
            serialNumber: detail.serialNumber,
            vehicleId: detail.vehicleId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
            expectedDate: detail.expectedDate ? new Date(detail.expectedDate) : null,
            actualDate: detail.actualDate ? new Date(detail.actualDate) : null,
            receptionStatus: detail.receptionStatus,
            condition: detail.condition,
          })),
        },
      },
    });

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error updating purchase: " + error });
  }
};

// Eliminar una orden de compra por ID
export const deletePurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.purchases.delete({
      where: { purchaseId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting purchase" });
  }
};
