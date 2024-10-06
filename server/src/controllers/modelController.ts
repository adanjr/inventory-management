import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los modelos o buscar por nombre
export const getModels = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const models = await prisma.models.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        make: true,              // Incluir la marca relacionada
        vehicleType: true,        // Incluir el tipo de vehículo
        engineType: true,         // Incluir el tipo de motor
        fuelType: true,           // Incluir el tipo de combustible (si aplica)
        transmission: true,       // Incluir la transmisión
      },
    });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving models" });
  }
};

// Crear un nuevo modelo
export const createModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      makeId,
      year_start,
      year_end,
      vehicleTypeId,
      engineTypeId,
      fuelTypeId,
      transmissionId,
      batteryCapacity,
      range,
      wheelCount,
      basePrice,
      chargeTime,
      motorWattage,
      weightCapacity,
      speed,
      batteryVoltage,
    } = req.body;

    console.log(req.body);

    const model = await prisma.models.create({
      data: {
        name,
        makeId,
        year_start,
        year_end,
        vehicleTypeId,
        engineTypeId,
        fuelTypeId,
        transmissionId,
        batteryCapacity,
        range,
        wheelCount,
        basePrice,
        chargeTime,
        motorWattage,
        weightCapacity,
        speed,
        batteryVoltage,
      },
    });
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ message: "Error creating model: " + error });
  }
};

// Obtener un modelo por ID
export const getModelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const model = await prisma.models.findUnique({
      where: { modelId: Number(id) },
      include: {
        make: true,              // Incluir la marca relacionada
        vehicleType: true,        // Incluir el tipo de vehículo
        engineType: true,         // Incluir el tipo de motor
        fuelType: true,           // Incluir el tipo de combustible (si aplica)
        transmission: true,       // Incluir la transmisión
        vehicles: true,           // Incluir los vehículos relacionados
      },
    });
    if (!model) {
      res.status(404).json({ message: "Model not found" });
    } else {
      res.json(model);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving model: " + error });
  }
};

// Actualizar un modelo por ID
export const updateModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      makeId,
      year_start,
      year_end,
      vehicleTypeId,
      engineTypeId,
      fuelTypeId,
      transmissionId,
      batteryCapacity,
      range,
      wheelCount,
      basePrice,
      chargeTime,
      motorWattage,
      weightCapacity,
      speed,
      batteryVoltage,
    } = req.body;

    const model = await prisma.models.update({
      where: { modelId: Number(id) },
      data: {
        name,
        makeId,
        year_start,
        year_end,
        vehicleTypeId,
        engineTypeId,
        fuelTypeId,
        transmissionId,
        batteryCapacity,
        range,
        wheelCount,
        basePrice,
        chargeTime,
        motorWattage,
        weightCapacity,
        speed,
        batteryVoltage,
      },
    });
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: "Error updating model: " + error });
  }
};

// Eliminar un modelo por ID
export const deleteModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.models.delete({
      where: { modelId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting model: " + error });
  }
};
