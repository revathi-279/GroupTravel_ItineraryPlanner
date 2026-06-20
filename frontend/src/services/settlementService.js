import { api } from "./api";

export const settlementService = {

  getSettlements:
    async (tripId) => {

      const response =
        await api.get(
          `/settlement/get-settlements/${tripId}`
        );

      return response.data;
    },

  markPaid:
    async (settlementId) => {

      const response =
        await api.patch(
          `/settlement/mark-paid/${settlementId}`
        );

      return response.data;
    },

  confirmPayment:
    async (settlementId) => {

      const response =
        await api.patch(
          `/settlement/confirm/${settlementId}`
        );

      return response.data;
    }

};