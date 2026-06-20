
import  {api} from "./api"

export const tripService = {

  getTrips: async () => {

    const response =
      await api.get(
        "/trip/get-trips"
      );

    return response.data;
  },

  createTrip: async (
    tripData
  ) => {

    const response =
      await api.post(
        "/trip/create-trip",
        tripData
      );

    return response.data;
  },

  getTrip: async (
    tripId
  ) => {

    const response =
      await api.get(
        `/trip/get-trip/${tripId}`
      );

    return response.data;
  },

  getTripStatistics:
  async (tripId) => {

    const response =
      await api.get(
        `/trip/statistics/${tripId}`
      );

    return response.data;
  },
  leaveTrip:
async (tripId) => {

  const response =
    await api.delete(
      `/trip/leave-trip/${tripId}`
    );

  return response.data;
},

addAdmin:
async (data) => {

  const response =
    await api.patch(
      "/trip/add-admin",
      data
    );

  return response.data;

},

removeAdmin:
async (
  tripId,
  adminId
) => {

  const response =
    await api.delete(
      `/trip/remove-admin/${tripId}/${adminId}`
    );

  return response.data;

},

removeMember:
async (
  tripId,
  memberId
) => {

  const response =
    await api.delete(
      `/trip/remove-member/${tripId}/${memberId}`
    );

  return response.data;

},
};