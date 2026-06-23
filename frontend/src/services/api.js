import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:https://group-travel-itinerary-planner-backend.onrender.com",
  withCredentials: true,
});