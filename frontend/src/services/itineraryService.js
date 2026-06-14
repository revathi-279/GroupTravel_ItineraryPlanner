import {api }from "./api";

export const itineraryService = {

  createItinerary:
    async (data) => {

      const response =
        await api.post(
          "/itinerary/create-itinerary",
          data
        );

      return response.data;
    },

  getItineraries:
    async (tripId) => {

      const response =
        await api.get(
          `/itinerary/get-itineraries/${tripId}`
        );

      return response.data;
    },

  updateItinerary:
    async (data) => {

      const response =
        await api.patch(
          "/itinerary/update-itinerary",
          data
        );

      return response.data;
    },

  deleteItinerary:
    async (itineraryId) => {

      const response =
        await api.delete(
          `/itinerary/delete-itinerary/${itineraryId}`
        );

      return response.data;
    },

};