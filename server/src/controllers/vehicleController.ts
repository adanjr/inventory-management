import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los vehículos o buscar por VIN, stockNumber o descripción
export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const vehicles = await prisma.vehicles.findMany({
      where: {
        OR: [
          { vin: { contains: search, mode: 'insensitive' } },
          { stockNumber: { contains: search , mode: 'insensitive'} },
          { internal_serial: { contains: search, mode: 'insensitive' } },
        ],
      },
      include: {
        model: {
          include: {
            make: true, // Incluir la relación con Make
            family: true,
          },
        },
        color: true,
        condition: true,
        availabilityStatus: true,
        status: true,
        location: true,
        warranty: true,
        batteryWarranty : true,
      },
    });

    const vehiclesWithDetails = vehicles.map(vehicle => ({
      ...vehicle,
      modelName: vehicle.model?.name || 'N/A',
      makeName: vehicle.model?.make?.name || 'N/A', // Obtener el nombre del fabricante
      familyName: vehicle.model?.family?.name || 'N/A',
      colorName: vehicle.color?.name || 'N/A',
      condition: vehicle.condition?.name || 'N/A',
      availabilityStatusName: vehicle.availabilityStatus?.name || 'N/A',
      statusName: vehicle.status?.name || 'N/A',
      locationName: vehicle.location?.name || 'N/A',
      warrantyInfo: vehicle.warranty?.description || 'N/A',
      batteryWarrantyInfo: vehicle.batteryWarranty?.description || 'N/A',
    }));

    res.json(vehiclesWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicles" });
  }
};

export const getVehiclesByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString() || '';
    const locationId = req.query.locationId ? Number(req.query.locationId) : null;

    // Validar que locationId es un número válido
    if (locationId !== null && isNaN(locationId)) {
      res.status(400).json({ message: 'Invalid locationId' });
      return;
    }

    const vehicles = await prisma.vehicles.findMany({
      where: {
        ...(locationId && { locationId }), // Filtrar solo si locationId es proporcionado
        OR: [
          { vin: { contains: search, mode: 'insensitive' } },
          { stockNumber: { contains: search, mode: 'insensitive' } },
          { internal_serial: { contains: search, mode: 'insensitive' } },
        ],
      },
      include: {
        model: {
          include: {
            make: true,
            family: true,
          },
        },
        color: true,
        condition: true,
        availabilityStatus: true,
        status: true,
        location: true,
        warranty: true,
        batteryWarranty: true,
      },
    });

    if (vehicles.length === 0) {
      res.status(404).json({ message: 'No vehicles found' });
      return;
    }

    const vehiclesWithDetails = vehicles.map(vehicle => ({
      ...vehicle,
      modelName: vehicle.model?.name || 'N/A',
      makeName: vehicle.model?.make?.name || 'N/A',
      familyName: vehicle.model?.family?.name || 'N/A',
      colorName: vehicle.color?.name || 'N/A',
      condition: vehicle.condition?.name || 'N/A',
      availabilityStatusName: vehicle.availabilityStatus?.name || 'N/A',
      statusName: vehicle.status?.name || 'N/A',
      locationName: vehicle.location?.name || 'N/A',
      warrantyInfo: vehicle.warranty?.description || 'N/A',
      batteryWarrantyInfo: vehicle.batteryWarranty?.description || 'N/A',
    }));

    res.json(vehiclesWithDetails);
  } catch (error) {
    console.error('Error retrieving vehicles:', error); // Log del error para depuración
    res.status(500).json({ message: "Error retrieving vehicles" });
  }
};

// Obtener un vehículo por ID
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicles.findUnique({
      where: { vehicleId: Number(id) },
      include: {
        model: {
          include: {
            make: true, // Asegúrate de incluir la relación de make
            family: true, // Asegúrate de incluir la relación de family
          },
        },
        color: true,
        condition: true,
        availabilityStatus: true,
        status: true,
        location: true,
        warranty: true,
        batteryWarranty: true,
      },
    });

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
    } else {
      // Extraer makeId y familyId
      const makeId = vehicle.model?.make?.makeId || null; // Puede ser null si no existe
      const familyId = vehicle.model?.family?.familyId || null; // Puede ser null si no existe

      // Devolver el vehículo junto con makeId y familyId
      res.json({
        ...vehicle,
        makeId,
        familyId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle" });
  }
};

export const getVehicleSummaryByModelAndColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { locationId } = req.query; // Obtener el locationId desde los parámetros de consulta

    if (!locationId) {
      res.status(400).json({ message: "Location ID is required" });
      return;
    }

    // Agrupar por modelo y color, con un conteo de vehículos
    const vehiclesByModelAndColor = await prisma.vehicles.groupBy({
      by: ['modelId', 'colorId'],
      where: {
        locationId: Number(locationId), // Filtrar por la sucursal
        availabilityStatus: {
          name: 'DISPONIBLE', // Filtrar solo por status 'DISPONIBLE'
        },
      },
      _count: {
        _all: true, // Contar el número total de vehículos
      },
    });

    // Obtener los nombres de modelo y color en una consulta aparte
    const modelIds = vehiclesByModelAndColor.map(v => v.modelId);
    const colorIds = vehiclesByModelAndColor.map(v => v.colorId);

    // Obtener modelos con todas sus relaciones
    const models = await prisma.models.findMany({
      where: {
        modelId: { in: modelIds },
      },
      include: {
        make: true,              // Incluir la marca relacionada
        family: true,            // Incluir la familia relacionada
        vehicleType: true,       // Incluir el tipo de vehículo
        engineType: true,        // Incluir el tipo de motor
        fuelType: true,          // Incluir el tipo de combustible (si aplica)
        transmission: true,      // Incluir la transmisión
      },
    });

    // Obtener colores
    const colors = await prisma.colors.findMany({
      where: {
        colorId: { in: colorIds },
      },
    });

    // Mapeamos y estructuramos el resultado
    const groupedByModel = vehiclesByModelAndColor.reduce((acc, vehicle) => {
      const model = acc.find(m => m.modelId === vehicle.modelId);

      // Si el modelo ya existe en el resultado acumulado
      if (model) {
        model.count += vehicle._count._all; // Sumar el conteo total al modelo existente
        model.colors.push({
          colorId: vehicle.colorId,
          colorName: colors.find(c => c.colorId === vehicle.colorId)?.name || 'N/A',
          hexadecimal: colors.find(c => c.colorId === vehicle.colorId)?.hexadecimal || 'N/A',
          count: vehicle._count._all,
        });
      } else {
        // Si es un nuevo modelo, lo añadimos al acumulador
        const modelData = models.find(m => m.modelId === vehicle.modelId);
        if (modelData) {
          // Agregamos todos los campos del modelo, permitiendo que sean null o undefined
          acc.push({
            modelId: modelData.modelId,
            modelName: modelData.name, // Asegúrate de que esta propiedad exista en tu modelo
            makeId: modelData.makeId,
            familyId: modelData.familyId ?? undefined,  // Si es null, cambiarlo a undefined
            year_start: modelData.year_start ?? undefined, // Si es null, cambiarlo a undefined
            year_end: modelData.year_end ?? undefined,
            vehicleTypeId: modelData.vehicleTypeId,
            vehicleType: modelData.vehicleType.name,
            engineTypeId: modelData.engineTypeId,
            fuelTypeId: modelData.fuelTypeId ?? undefined,
            transmissionId: modelData.transmissionId,
            batteryCapacity: modelData.batteryCapacity ?? undefined,
            range: modelData.range ?? undefined,
            wheelCount: modelData.wheelCount,
            basePrice: modelData.basePrice,
            chargeTime: modelData.chargeTime,
            motorWattage: modelData.motorWattage ?? undefined,
            weightCapacity: modelData.weightCapacity,
            speed: modelData.speed,
            batteryVoltage: modelData.batteryVoltage,
            rating: modelData.rating ?? undefined,
            mainImageUrl: modelData.mainImageUrl ?? undefined,
            count: vehicle._count._all,
            colors: [
              {
                colorId: vehicle.colorId,
                colorName: colors.find(c => c.colorId === vehicle.colorId)?.name || 'N/A',
                hexadecimal: colors.find(c => c.colorId === vehicle.colorId)?.hexadecimal || 'N/A',
                count: vehicle._count._all,
              },
            ],
          });
        }
      }

      return acc;
    }, [] as Array<{
      modelId: number,
      modelName: string,
      makeId: number,
      familyId?: number | null,
      year_start?: string | null,
      year_end?: string | null,
      vehicleTypeId: number,
      vehicleType: string,
      engineTypeId: number,
      fuelTypeId?: number | null,
      transmissionId: number,
      batteryCapacity?: number | null,
      range?: number | null,
      wheelCount: number,
      basePrice: number,
      chargeTime: number,
      motorWattage?: number | null,
      weightCapacity: number,
      speed: number,
      batteryVoltage: number,
      rating?: number | null,
      mainImageUrl?: string | null,
      count: number,
      colors: Array<{ colorId: number, colorName: string, hexadecimal:string, count: number }>,
    }>);

    res.json(groupedByModel);
  } catch (error) {
    console.error(error); // Loguear el error para depuración
    res.status(500).json({ message: "Error retrieving vehicle summary by model and color" });
  }
};


// Crear un nuevo vehículo
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      vin,
      internal_serial,
      modelId,
      year,
      colorId,
      mileage,
      price,
      conditionId,
      availabilityStatusId,
      statusId,
      locationId,
      stockNumber,
      barcode,
      qrCode,
      description,
      warrantyId,
      batteryWarrantyId,
    } = req.body;    

    const vehicle = await prisma.vehicles.create({
      data: {
        vin,
        internal_serial,
        modelId,
        year,
        colorId,
        mileage,
        price,
        conditionId,
        availabilityStatusId,
        statusId,
        locationId,
        stockNumber,
        barcode,
        qrCode,
        description,
        warrantyId,
        batteryWarrantyId,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error creating vehicle: " + error });
  }
};

export const createVehicleFromCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      internal_serial,
      modelName,
      colorName,
      availabilityStatusName,
      locationId,
    } = req.body;    

    console.log(req.body);

    // Buscar los IDs correspondientes para los nombres que vienen en el CSV
    const model = await prisma.models.findUnique({
      where: { name: modelName },
    });
    if (!model) {
      console.log(`Model not found: ${modelName}`);
      res.status(400).json({ message: `Model not found: ${modelName}` });
    };
    const defaultPrice = model?.basePrice || 0;

    const color = await prisma.colors.findUnique({
      where: { name: colorName },
    });
    if (!color) {
      console.log(`Color not found: ${colorName}`);
      res.status(400).json({ message: `Color not found: ${colorName}` });
    }

    const availabilityStatus = await prisma.vehicleAvailabilityStatus.findFirst({
      where: { name: availabilityStatusName },
    });
    if (!availabilityStatus) {
      console.log(`Availability Status not found: ${availabilityStatusName}`);
      res.status(400).json({ message: `Availability Status not found: ${availabilityStatusName}` });
    }

    const condition = await prisma.vehicleCondition.findFirst({});
    if (!condition) {
      console.log(`No condition found.`);
      res.status(400).json({ message: `No condition found.` });
    }
    const defaultConditionId = condition?.conditionId;

    const status = await prisma.vehicleStatus.findFirst({});
    if (!status) {
      console.log(`No status found.`);
      res.status(400).json({ message: `No status found.` });
    }
    const defaultStatusId = status?.statusId;

    const warranty = await prisma.warranty.findFirst({});
    if (!warranty) {
      console.log(`No warranty found.`);
      res.status(400).json({ message: `No warranty found.` });
    }
    const defaultWarrantyId = warranty?.warrantyId;

    const batteryWarranty = await prisma.batteryWarranty.findFirst({});
    if (!batteryWarranty) {
      console.log(`No battery warranty found.`);
      res.status(400).json({ message: `No battery warranty found.` });
    }
    const defaultBatteryWarrantyId = batteryWarranty?.batteryWarrantyId;

    const defaultYear = new Date().getFullYear();
    const defaultMileage = 0;
    const defaultVin = "N/A";
    const defaultStockNumber = "N/A";
    const defaultBarcode = "";
    const defaultQRCode = "";
    const defaultDescription = "Vehiculo Cargado via Importacion de Archivo CSV";

    // Crear el vehículo con los IDs encontrados
    const vehicle = await prisma.vehicles.create({
      data: {
        vin: defaultVin,
        internal_serial,
        modelId: model?.modelId || 1,
        year: defaultYear,
        colorId: color?.colorId || 1,
        mileage: defaultMileage,
        price: defaultPrice,
        conditionId: defaultConditionId || 1,
        availabilityStatusId: availabilityStatus?.statusId || 1,
        statusId: defaultStatusId || 1,
        locationId: locationId || 1,
        stockNumber: defaultStockNumber,
        barcode: defaultBarcode,
        qrCode: defaultQRCode,
        description: defaultDescription,
        warrantyId: defaultWarrantyId || 1,
        batteryWarrantyId: defaultBatteryWarrantyId || 1,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating vehicle from CSV: " + error });
  }
};

// Actualizar un vehículo por ID
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      vin,
      internal_serial,
      modelId,
      makeId,
      familyId,
      year,
      colorId,
      mileage,
      price,
      conditionId,
      availabilityStatusId,
      statusId,
      locationId,
      stockNumber,
      barcode,
      qrCode,
      description,
      warrantyId,
      batteryWarrantyId,
    } = req.body;

    console.log(req.body);

    const vehicle = await prisma.vehicles.update({
      where: { vehicleId: Number(id) },
      data: {
        vin,
        internal_serial,
        modelId,
        year,
        colorId,
        mileage,
        price,
        conditionId,
        availabilityStatusId,
        statusId,
        locationId,
        stockNumber,
        barcode,
        qrCode,
        description,
        warrantyId,
        batteryWarrantyId,
      },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle" });
  }
};

// Eliminar un vehículo por ID
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicles.delete({
      where: { vehicleId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle" });
  }
};
