import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, customerId } = req.query;

    // Convierte las fechas a Date si se proporcionan
    const start = startDate ? new Date(startDate.toString()) : undefined;
    const end = endDate ? new Date(endDate.toString()) : undefined;

    const sales = await prisma.sales.findMany({
      where: {
        AND: [
          start ? { timestamp: { gte: start } } : {},
          end ? { timestamp: { lte: end } } : {},
          customerId ? { customerId: Number(customerId) } : {}, // Filtrar por customerId
        ],
      },
      include: {
        customer: true, // Incluye la información del cliente
        location: true, // Incluye la información de la ubicación
        saleDetails: {
          include: {
            product: true, // Incluye información del producto
            vehicle: true, // Incluye información del vehículo
          },
        },
      },
    });

    const salesWithDetails = sales.map(sale => ({
      ...sale,
      customerName: sale.customer?.name + ' ' + sale.customer?.lastname || 'N/A', // Obtener el nombre del cliente
      locationName: sale.location?.name || 'N/A', // Obtener el nombre de la ubicación
    }));

    res.json(salesWithDetails);
  } catch (error) {
    console.error(error); // Imprimir el error en el servidor para depuración
    res.status(500).json({ message: "Error retrieving sales" });
  }
};


// Obtener una venta por ID
export const getSaleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Busca la venta por ID
    const sale = await prisma.sales.findUnique({
      where: { saleId: Number(id) }, // Asegúrate de que el campo coincida con tu modelo
      include: {
        customer: true, // Incluye la información del cliente
        location: true, // Incluye la información de la ubicación
        saleDetails: {
          include: {
            product: true, // Incluye la información del producto
            vehicle: {
              include: {
                model: { // Incluye la información del modelo del vehículo
                  include: {
                    make: true, // Incluir la relación con el fabricante
                    family: true, // Incluir la relación con la familia
                    vehicleType: true,
                  },
                },
                color: true, // Incluye la información del color del vehículo
                condition: true, // Incluye la condición del vehículo
                availabilityStatus: true, // Estado de disponibilidad
                status: true, // Estado del vehículo
                warranty: true, // Incluye la información de la garantía
                batteryWarranty: true, // Incluye la información de la garantía de batería
              },
            },
          },
        },
      },
    });

    // Verifica si se encontró la venta
    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
    } else {
      res.json(sale); // Devuelve la venta con toda la información relacionada
    }
  } catch (error) {
    console.error(error); // Imprimir el error en el servidor para depuración
    res.status(500).json({ message: "Error retrieving sale" });
  }
};


// Crear una nueva venta
  export const createSale = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        totalAmount,
        paymentMethod,
        customerId,
        customerData,
        enviarADomicilio,
        recogerEnTieda,
        compraOnline,
        locationId,
        saleDetails,
      } = req.body;
  
      // Validación básica de datos
      if (!totalAmount || !paymentMethod || !saleDetails || saleDetails.length === 0) {
        res.status(400).json({ message: "Missing required sale data." });
      }
  
      // Transacción para asegurar consistencia
      const result = await prisma.$transaction(async (prisma) => {
        // Buscar o crear el cliente
        let customer = null;
        if (customerId && customerId > 0) {
          customer = await prisma.customers.findUnique({ where: { customerId } });
          if (!customer) {
            throw new Error("Customer not found");
          }
        } else if (customerData) {
          customer = await prisma.customers.create({
            data: {
              name: customerData.name,
              lastname: customerData.lastname,
              email: customerData.email,
              phone: customerData.phone,
              address: customerData.address,
              postalCode: customerData.postalCode,
              city: customerData.city,
              state: customerData.state,
              country: customerData.country,
              mainImageUrl: customerData.mainImageUrl,
            },
          });
        }
  
        // Buscar la ubicación si locationId es proporcionado
        let location = null;
        if (locationId) {
          location = await prisma.locations.findUnique({ where: { locationId } });
          if (!location) {
            throw new Error("Location not found");
          }
        }
  
        // Preparar los detalles de la venta
        const saleDetailsWithVehicle = await Promise.all(
          saleDetails.map(async (detail: any) => {
            if (detail.isVehicle) {
              const vehicle = await prisma.vehicles.findFirst({
                where: {
                  modelId: detail.modelId,
                  colorId: detail.colorId,
                  locationId: locationId, // LocationId proporcionado en el detalle
                },
              });
  
              if (!vehicle) {
                throw new Error(`Vehicle not found with modelId ${detail.modelId}, colorId ${detail.colorId}, locationId ${detail.locationId}`);
              }
  
              return {
                productId: detail.productId,
                vehicleId: vehicle.vehicleId,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                subtotal: detail.subtotal,
                assemblyAndConfigurationCost: detail.assemblyAndConfigurationCost,
              };
            }
  
            return {
              productId: detail.productId,
              vehicleId: detail.vehicleId ?? null,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              subtotal: detail.subtotal,
              assemblyAndConfigurationCost: detail.assemblyAndConfigurationCost,
            };
          })
        );
  
        // Crear la venta
        const sale = await prisma.sales.create({
          data: {
            totalAmount,
            paymentMethod,
            customerId: customer?.customerId ?? null,
            enviarADomicilio,
            recogerEnTieda,
            compraOnline,
            locationId: location?.locationId ?? null,
            timestamp: new Date(),
            saleDetails: {
              create: saleDetailsWithVehicle,
            },
          },
        });
  
        // Crear un movimiento
        const movement = await prisma.movements.create({
          data: {
            fromLocationId: location?.locationId ?? null,
            toLocationId: null,
            quantity: saleDetailsWithVehicle.length,
            movementType: 'VENTA',
            movementDate: new Date(),
            status: 'COMPLETO',
            notes: 'Movimiento por venta',
            approved: true,
            orderReference: sale.saleId.toString(),
          },
        });
  
        // Crear los detalles del movimiento
        await prisma.movementDetail.createMany({
          data: saleDetailsWithVehicle.map((detail: any) => ({
            movementId: movement.movementId,
            vehicleId: detail.vehicleId ?? null,
            productId: detail.productId,
            inspectionStatus: 'PASSED',
          })),
        });
  
        // Actualizar vehículos
        const vehicleStatus = await prisma.vehicleAvailabilityStatus.findFirst({
          where: { name: 'VENDIDO' },
        });
  
        await prisma.vehicles.updateMany({
          where: {
            vehicleId: {
              in: saleDetailsWithVehicle.map((detail: any) => detail.vehicleId).filter(Boolean), // Solo IDs no nulos
            },
          },
          data: {
            locationId: null,
            availabilityStatusId: vehicleStatus?.statusId ?? 0,
          },
        });
  
        return sale;
      });
  
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: `Error creating sale.` });
    }
  };
  
  
// Actualizar una venta por ID
export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      totalAmount,
      paymentMethod,
      customerId,
      customerData,
      enviarADomicilio,
      recogerEnTieda,
      compraOnline,
      locationId,
      saleDetails,
    } = req.body;

    // Buscar o crear el cliente si es necesario
    let customer = null;
    if (customerId && customerId > 0) {
      customer = await prisma.customers.findUnique({ where: { customerId } });
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
      }
    } else if (customerData) {
      customer = await prisma.customers.create({
        data: {
          name: customerData.name,
          lastname: customerData.lastname,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          postalCode: customerData.postalCode,
          city: customerData.city,
          state: customerData.state,
          country: customerData.country,
          mainImageUrl: customerData.mainImageUrl,
        },
      });
    }

    // Buscar la ubicación si locationId es proporcionado
    let location = null;
    if (locationId) {
      location = await prisma.locations.findUnique({ where: { locationId } });
      if (!location) {
        res.status(404).json({ message: "Location not found" });
      }
    }

    // Actualizar la venta
    const sale = await prisma.sales.update({
      where: { saleId: Number(id) },
      data: {
        totalAmount,
        paymentMethod,
        customerId: customer?.customerId ?? null,
        enviarADomicilio,
        recogerEnTieda,
        compraOnline,
        locationId: location?.locationId ?? null,
        saleDetails: {
          deleteMany: {}, // Eliminar los detalles existentes
          create: saleDetails.map((detail: any) => ({
            productId: detail.productId,
            vehicleId: detail.vehicleId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
            assemblyAndConfigurationCost: detail.assemblyAndConfigurationCost,
          })),
        },
      },
    });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error updating sale: " + error });
  }
};

// Eliminar una venta por ID
export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.sales.delete({
      where: { saleId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale" });
  }
};
