import express from "express"; //Loads express framework
import cors from "cors";
import cookieParser from "cookie-parser";

import {authApp} from "./routes/AuthRoutes.js";
import { tripApp } from "./routes/TripRoutes.js";
import { pollApp } from "./routes/PollRoutes.js";
import { itineraryApp } from "./routes/ItineraryRoutes.js";
import {expenseApp} from "./routes/ExpenseRoutes.js";
import { galleryApp } from "./routes/GalleryRoutes.js";
import {
    userApp
}
from "./routes/UserRoutes.js";

import {
    notificationApp
}
from "./routes/NotificationRoutes.js";
import {
    weatherApp
}
from "./routes/WeatherRoutes.js";

import { activityApp }
from "./routes/ActivityRoutes.js";

// Creates express application
const app = express();
// Frontend and backend communication
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

// Convert json into js object
app.use(express.json());
// Reads cookies from request
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/cors-test", (req, res) => {
  res.json({
    success: true,
  });
});

app.use("/auth", authApp);
app.use("/trip", tripApp);
app.use("/poll",pollApp);
app.use("/itinerary",itineraryApp);
app.use("/expense",expenseApp);
app.use("/gallery",galleryApp);
app.use(
    "/user",
    userApp
);
app.use(
    "/notification",
    notificationApp
);
app.use(
    "/weather",
    weatherApp
);
app.use(
  "/activity",
  activityApp
);

export default app;
