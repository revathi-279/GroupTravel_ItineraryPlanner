import axios from "axios";

export const api = axios.create({
  baseURL: "https://group-travel-itinerary-planner-backend.onrender.com",
  withCredentials: true,
});