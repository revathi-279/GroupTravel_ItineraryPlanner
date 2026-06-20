import { api } from "./api";

export const weatherService = {

  getWeather:
  async (tripId) => {

    const response =
      await api.get(
        `/weather/${tripId}`
      );

    return response.data;
  }

};