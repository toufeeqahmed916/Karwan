import { Router } from "express";

import {
  checkDatabaseConnection,
  getSeedCounts,
} from "../repositories/databaseRepository.js";

export const healthRouter = Router();

healthRouter.get("/live", (_req, res) => {
  res.json({
    data: {
      status: "ok",
      service: "karwan-backend",
    },
  });
});

healthRouter.get("/ready", async (_req, res, next) => {
  try {
    await checkDatabaseConnection();
    const seedCounts = await getSeedCounts();

    res.json({
      data: {
        status: "ready",
        database: "connected",
        seedCounts,
      },
    });
  } catch (error) {
    next(error);
  }
});
