import express from "express";
import { createItinerary,deleteItinerary,getItineraries, getSingleItinerary, updateItinerary } from "../controllers/ItineraryController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js"

export const itineraryApp = express.Router();

itineraryApp.post("/create-itinerary",verifyToken,createItinerary);
itineraryApp.get("/get-itineraries/:tripId",verifyToken,getItineraries);
itineraryApp.get("/get-itinerary/:itineraryId",verifyToken,getSingleItinerary);
itineraryApp.patch("/update-itinerary",verifyToken,updateItinerary);
itineraryApp.delete("/delete-itinerary/:itineraryId",verifyToken,deleteItinerary);

