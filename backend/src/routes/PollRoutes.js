import express from "express";
import { createPoll, getAllPolls, getSinglePoll, votePoll, deletePoll } from "../controllers/PollController.js"
import { verifyToken } from "../middlewares/AuthMiddleware.js";

export const pollApp = express.Router();

pollApp.post("/create-poll", verifyToken, createPoll);
pollApp.get("/get-polls/:tripId", verifyToken, getAllPolls);
pollApp.get("/get-poll/:pollId", verifyToken, getSinglePoll);
pollApp.post("/vote-poll", verifyToken, votePoll);
pollApp.delete("/delete-poll/:pollId", verifyToken, deletePoll);