import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener total de vehículos por sucursal
export const getVehiclesCountByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehiclesCount = await prisma.vehicles.groupBy({
      by: ['locationId'],
      _count: {
        vehicleId: true,
      },
    });

    // Similar al método anterior para mapear ubicaciones
    const countsWithLocationNames = await Promise.all(
      vehiclesCount.map(async (count) => {
        // Si el locationId es null, no realices la consulta, simplemente asigna 'N/A'
        if (count.locationId === null) {
          return {
            locationId: 0,
            count: count._count.vehicleId,
            locationName: 'VENDIDO', // Valor predeterminado si no hay locationId
          };
        }
    
        // Si locationId no es null, realiza la consulta
        const location = await prisma.locations.findUnique({
          where: { locationId: count.locationId },
        });
    
        return {
          locationId: count.locationId,
          count: count._count.vehicleId,
          locationName: location ? location.name : 'N/A', // Si no se encuentra la ubicación, asigna 'N/A'
        };
      })
    );

    res.json(countsWithLocationNames);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle counts by location" });
  }
};

export const getVehicleCountsGrouped = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.query;

    // Agrupar por modelId, colorId y availabilityStatusId
    const groupedVehicles = await prisma.vehicles.groupBy({
      by: ['modelId', 'colorId', 'availabilityStatusId'],
      where: locationId
        ? { locationId: parseInt(locationId as string) }
        : {},
      _count: {
        vehicleId: true,
      },
    });

    // Obtener los nombres de los modelos, colores y availabilityStatus en consultas adicionales
    const vehiclesWithNames = await Promise.all(
      groupedVehicles.map(async (group) => {
        const model = await prisma.models.findUnique({
          where: { modelId: group.modelId },
          select: { name: true },
        });

        const color = await prisma.colors.findUnique({
          where: { colorId: group.colorId },
          select: { name: true },
        });

        const availabilityStatus = await prisma.vehicleAvailabilityStatus.findUnique({
          where: { statusId: group.availabilityStatusId },
          select: { name: true },
        });

        return {
          modelName: model?.name || "Desconocido",
          colorName: color?.name || "Desconocido",
          availabilityStatus: availabilityStatus?.name || "Desconocido",
          count: group._count.vehicleId,
        };
      })
    );

    res.json({ groupedData: vehiclesWithNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los vehículos agrupados" });
  }
};