import { Router } from "express";

import {
  deleteDepotVehicle,
  getDepots,
  patchDepot,
  patchDepotInventory,
  patchDepotVehicle,
  postDepotVehicle,
} from "../controllers/inventoryController.js";

export const depotsRouter = Router();

depotsRouter.get("/", getDepots);
depotsRouter.patch("/:id/inventory", patchDepotInventory);
depotsRouter.post("/:id/vehicles", postDepotVehicle);
depotsRouter.patch("/:id/vehicles/:vehicleId", patchDepotVehicle);
depotsRouter.delete("/:id/vehicles/:vehicleId", deleteDepotVehicle);
depotsRouter.patch("/:id", patchDepot);
