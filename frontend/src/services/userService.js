import { api } from "./api";

export const userService = {


searchUsers: async (query,tripId) => {

  const response =
    await api.get(
      `/user/search?q=${query}&tripId=${tripId}`
    );

  return response.data;
},
}