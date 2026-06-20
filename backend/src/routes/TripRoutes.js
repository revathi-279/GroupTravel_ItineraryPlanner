import express from "express";
import { createTrip, getAllTrips, getTrip, updateTrip, deleteTrip,searchTrips } from "../controllers/TripController.js";
import { addMember, getMembers, removeMember, addAdmin, removeAdmin, leaveTrip, updateTripCoverImage,getTripStatistics } from "../controllers/TripController.js";
import {
  getMemberStats
}
from "../controllers/MemberController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload
from "../middlewares/Multer.js";

export const tripApp = express.Router();

// Create Trip route
tripApp.post("/create-trip", verifyToken, createTrip);
tripApp.get("/get-trips", verifyToken, getAllTrips);
tripApp.get("/get-trip/:tripId", verifyToken, getTrip);
tripApp.patch("/update-trip", verifyToken, updateTrip);
tripApp.delete("/delete-trip/:tripId", verifyToken, deleteTrip);
tripApp.post("/add-member", verifyToken, addMember);
tripApp.get("/get-members/:tripId", verifyToken, getMembers);
tripApp.delete("/remove-member/:tripId/:memberId", verifyToken, removeMember);
tripApp.patch("/add-admin", verifyToken, addAdmin);
tripApp.delete("/remove-admin/:tripId/:adminId", verifyToken, removeAdmin);
tripApp.delete("/leave-trip/:tripId", verifyToken, leaveTrip);
tripApp.patch(
    "/update-cover-image/:tripId",
    verifyToken,
    upload.single("coverImage"),
    updateTripCoverImage
);
tripApp.get(
    "/statistics/:tripId",
    verifyToken,
    getTripStatistics
);
tripApp.get(
    "/search",
    verifyToken,
    searchTrips
);

tripApp.get(
  "/member-stats/:tripId/:memberId",
  verifyToken,
  getMemberStats
);

