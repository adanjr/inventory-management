import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSaleReturns = async (req: Request, res: Response): Promise<void> => {
    try {
      const saleReturns = await prisma.salesReturns.findMany({
        include: {
          sale: true,
          returnDetails: true,
        },
      });
      res.status(200).json(saleReturns);
    } catch (error) {
      console.error("Error retrieving sale returns:", error);
      res.status(500).json({ message: "Error retrieving sale returns." });
    }
  };
  
  // Obtener una devolución de venta en particular con todos los detalles
  export const getSaleReturnById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const saleReturn = await prisma.salesReturns.findUnique({
        where: { returnId: Number(id) },
        include: {
          sale: {
            include: {
              saleDetails: {
                include: {
                  product: true, 
                  vehicle: true, 
                },
              },
            },
          },
          returnDetails: {
            include: {
                vehicle: true,  
            },
          },
        },
      });
  
      if (!saleReturn) {
        res.status(404).json({ message: "Sale return not found." });
        return;
      }
  
      res.status(200).json(saleReturn);
    } catch (error) {
      console.error("Error retrieving sale return:", error);
      res.status(500).json({ message: "Error retrieving sale return." });
    }
  };

// Crear una devolución de venta
export const createSaleReturn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { originalSaleId, returnedItems, processedBy, locationId, reason } = req.body;

    // Validación básica de datos
    if (!originalSaleId || !returnedItems || returnedItems.length === 0) {
      res.status(400).json({ message: "Missing required return data." });
      return;
    }

    // Buscar la venta original
    const sale = await prisma.sales.findUnique({
      where: { saleId: originalSaleId },
      include: {
        saleDetails: true,
        location: true, // Incluye la ubicación para restituir el inventario correctamente
      },
    });

    if (!sale) {
      res.status(404).json({ message: "Sale not found." });
      return;
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Crear la devolución
      const saleReturn = await prisma.salesReturns.create({
        data: {
          originalSaleId,
          reason,
          totalAmount : 0,
          timestamp: new Date(),
          processedBy,
          locationId,     
          returnDetails: {
            create: returnedItems.map((item: any) => ({
              saleDetailId: item.saleDetailId,
              quantityReturned: item.quantity,
            })),
          },
        },
      });

      // Crear un movimiento para la devolución
      const returnMovement = await prisma.movements.create({
        data: {
          fromLocationId: null,
          toLocationId: sale.location?.locationId ?? null,
          quantity: returnedItems.length,
          movementType: 'DEVOLUCIÓN',
          movementDate: new Date(),
          status: 'COMPLETO',
          notes: 'Movimiento por devolución de venta',
          approved: true,
          orderReference: saleReturn.returnId.toString(),
        },
      });

      // Crear detalles del movimiento
      await prisma.movementDetail.createMany({
        data: returnedItems.map((item: any) => ({
          movementId: returnMovement.movementId,
          vehicleId: item.vehicleId ?? null,
          productId: item.productId ?? null,
          inspectionStatus: 'PASSED',
        })),
      });

      // Actualizar inventario y restituir vehículos devueltos
      for (const item of returnedItems) {
        const saleDetail = sale.saleDetails.find(
          (detail) => detail.saleDetailId === item.saleDetailId
        );

        // Restituir vehículo a la ubicación original
        if (saleDetail?.vehicleId) {
          await prisma.vehicles.update({
            where: { vehicleId: saleDetail.vehicleId },
            data: {
              locationId: sale.location?.locationId,
              availabilityStatusId: (await prisma.vehicleAvailabilityStatus.findFirst({
                where: { name: "DISPONIBLE" },
              }))?.statusId ?? 0,
            },
          });
        }

        // Actualizar el stock del producto devuelto
        if (saleDetail?.productId) {
          await prisma.products.update({
            where: { productId: saleDetail.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }

      return saleReturn;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating sale return:", error);
    res.status(500).json({ message: "Error creating sale return." });
  }
};
