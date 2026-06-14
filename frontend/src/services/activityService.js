import { api }
from "./api";

export const activityService = {

  getActivities:
  async (tripId) => {

    const response =
      await api.get(
        `/activity/${tripId}`
      );

    return response.data;
  }

};