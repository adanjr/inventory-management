import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import manufacturerRoutes from "./routes/manufacturerRoutes";
import customerRoutes from "./routes/customerRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import locationRoutes from "./routes/locationRoutes";
import vehicleTypeRoutes from "./routes/vehicleTypeRoutes"; // Rutas para VehicleTypes
import makeRoutes from "./routes/makeRoutes"; // Rutas para Makes
import modelRoutes from "./routes/modelRoutes"; // Rutas para Models
import colorRoutes from "./routes/colorRoutes"; // Rutas para Colors
import engineTypeRoutes from "./routes/engineTypeRoutes"; // Rutas para EngineTypes
import fuelTypeRoutes from "./routes/fuelTypeRoutes"; // Rutas para FuelTypes
import transmissionRoutes from "./routes/transmissionRoutes"; // Rutas para Transmissions
import vehicleStatusRoutes from "./routes/vehicleStatusRoutes"; // Rutas para VehicleStatus
import vehicleRoutes from "./routes/vehicleRoutes"; // Rutas para Vehicles
import auditLogsRoutes from "./routes/auditLogsRoutes";
import auditTypesRoutes from "./routes/auditTypesRoutes";
import inventoryLocationsRoutes from "./routes/inventoryLocationsRoutes";
import movementsRoutes from "./routes/movementsRoutes";
import vehicleConditionsRoutes from "./routes/vehicleConditionsRoutes";
import vehicleInventoryLocationsRoutes from "./routes/vehicleInventoryLocationsRoutes";
import warrantyRoutes from "./routes/warrantyRoutes";
import batteryWarrantyRoutes from "./routes/batteryWarrantyRoutes";
import vehicleAvailabilityStatusRoutes from "./routes/vehicleAvailabilityStatusRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses
app.use("/manufacturers", manufacturerRoutes); // http://localhost:8000/manufacturers
app.use("/customers", customerRoutes); // http://localhost:8000/customers
app.use("/suppliers", supplierRoutes); // http://localhost:8000/suppliers
app.use("/categories", categoryRoutes); // http://localhost:8000/categories
app.use("/locations", locationRoutes); // http://localhost:8000/locations
app.use("/vehicle-types", vehicleTypeRoutes); // http://localhost:8000/vehicle-types
app.use("/makes", makeRoutes); // http://localhost:8000/makes
app.use("/models", modelRoutes); // http://localhost:8000/models
app.use("/colors", colorRoutes); // http://localhost:8000/colors
app.use("/engine-types", engineTypeRoutes); // http://localhost:8000/engine-types
app.use("/fuel-types", fuelTypeRoutes); // http://localhost:8000/fuel-types
app.use("/transmissions", transmissionRoutes); // http://localhost:8000/transmissions
app.use("/vehicle-status", vehicleStatusRoutes); // http://localhost:8000/vehicle-status
app.use("/vehicles", vehicleRoutes); // http://localhost:8000/vehicles
app.use("/audit-logs", auditLogsRoutes); // http://localhost:8000/audit-logs
app.use("/audit-types", auditTypesRoutes); // http://localhost:8000/audit-types
app.use("/inventory-locations", inventoryLocationsRoutes); // http://localhost:8000/inventory-locations
app.use("/movements", movementsRoutes); // http://localhost:8000/movements
app.use("/vehicle-availability-status", vehicleAvailabilityStatusRoutes); // http://localhost:8000/vehicle-availability-status
app.use("/vehicle-conditions", vehicleConditionsRoutes); // http://localhost:8000/vehicle-conditions
app.use("/vehicle-inventory-locations", vehicleInventoryLocationsRoutes); // http://localhost:8000/vehicle-inventory-locations
app.use("/warranties", warrantyRoutes); // http://localhost:8000/warranties
app.use("/batteryWarranties", batteryWarrantyRoutes); // http://localhost:8000/batteryWarranties

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});