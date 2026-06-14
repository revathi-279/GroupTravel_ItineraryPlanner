import { api }
from "./api";

export const pollService = {

  getPolls:
    async (tripId) => {

      const response =
        await api.get(
          `/poll/get-polls/${tripId}`
        );

      return response.data;
    },

  createPoll:
    async (data) => {

      const response =
        await api.post(
          "/poll/create-poll",
          data
        );

      return response.data;
    },

  votePoll:
    async (data) => {

      const response =
        await api.post(
          "/poll/vote-poll",
          data
        );

      return response.data;
    },

  deletePoll:
    async (pollId) => {

      const response =
        await api.delete(
          `/poll/delete-poll/${pollId}`
        );

      return response.data;
    },

};