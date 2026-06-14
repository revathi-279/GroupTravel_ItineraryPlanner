import { api } from "./api";

export const expenseService = {

  getExpenses:
    async (tripId) => {

      const response =
        await api.get(
          `/expense/get-expenses/${tripId}`
        );

      return response.data;
    },

  addExpense:
    async (data) => {

      const response =
        await api.post(
          "/expense/add-expense",
          data
        );

      return response.data;
    },

  updateExpense:
  async (data) => {

    const response =
      await api.patch(
        "/expense/update-expense",
        data
      );

    return response.data;
  },

  deleteExpense:
    async (expenseId) => {

      const response =
        await api.delete(
          `/expense/delete-expense/${expenseId}`
        );

      return response.data;
    },

  getSummary:
    async (tripId) => {

      const response =
        await api.get(
          `/expense/expense-summary/${tripId}`
        );

      return response.data;
    },

};