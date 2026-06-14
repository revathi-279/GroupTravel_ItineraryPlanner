import express
from "express";

import {
  getTripActivities
}
from "../controllers/ActivityController.js";

import {
  verifyToken
}
from "../middlewares/AuthMiddleware.js";

export const activityApp =
  express.Router();

activityApp.get(
  "/:tripId",
  verifyToken,
  getTripActivities
);