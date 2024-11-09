import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function resetIdentity() {
  try {
    // Reemplaza "TableName" con el nombre de tu tabla
    await prisma.$executeRaw`TRUNCATE TABLE public."Module" RESTART IDENTITY CASCADE`;
    console.log('IDs reiniciados correctamente.');
  } catch (error) {
    console.error('Error al reiniciar IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteTodayVehicles() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ajustar la hora al inicio del día para que el filtro incluya solo registros de hoy

  try {
    const deletedVehicles = await prisma.vehicles.deleteMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    console.log(`${deletedVehicles.count} vehículos eliminados.`);
  } catch (error) {
    console.error("Error al eliminar vehículos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    //"expenseSummary.json",     
    //"expenses.json",
    //"expenseByCategory.json",
    "module.json",     
    "subModule.json",
    "permission.json",
    "rolePermission.json",
  ];

  //await resetIdentity();
  //await deleteAllData(orderedFileNames);
  await deleteTodayVehicles();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });