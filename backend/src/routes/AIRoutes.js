// routes/AIRoutes.js

import express from "express";
import { getTripInsights } from "../controllers/AIController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get(
  "/trip-insights/:tripId",
  verifyToken,
  getTripInsights
);

router.post(
  "/trip-insights/:tripId/refresh",
  verifyToken,
  getTripInsights
);

export default router;