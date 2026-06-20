import { api } from "./api";

export const memberService = {

  getMemberStats:
  async (
    tripId,
    memberId
  ) => {

    const response =
      await api.get(
        `/trip/member-stats/${tripId}/${memberId}`
      );

    return response.data;

  }

};