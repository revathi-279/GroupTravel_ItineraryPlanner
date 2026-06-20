import { api }
from "./api";

export const aiService = {

  getTripInsights:
    async (tripId) => {

      const response =
        await api.get(
          `/ai/trip-insights/${tripId}`
        );

      return response.data;
    },

  refreshTripInsights:
    async (tripId) => {

      const response =
        await api.post(
          `/ai/trip-insights/${tripId}/refresh`
        );

      return response.data;
    }

};