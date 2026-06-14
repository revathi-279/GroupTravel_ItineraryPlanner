import express from "express";

import {
    getWeather
}
from "../controllers/WeatherController.js";

import {
    verifyToken
}
from "../middlewares/AuthMiddleware.js";

export const weatherApp =
    express.Router();

weatherApp.get(
    "/:tripId",
    verifyToken,
    getWeather
);