import { api } from "./api";

export const notificationService = {

  getNotifications:
  async () => {

    const response =
      await api.get(
        "/notification/get-notifications"
      );

    return response.data;
  },

  getUnreadCount:
  async () => {

    const response =
      await api.get(
        "/notification/unread-count"
      );

    return response.data;
  },

  acceptInvitation:
  async (notificationId) => {

    const response =
      await api.patch(
        "/notification/accept-invitation",
        {
          notificationId
        }
      );

    return response.data;
  },

  rejectInvitation:
  async (notificationId) => {

    const response =
      await api.patch(
        "/notification/reject-invitation",
        {
          notificationId
        }
      );

    return response.data;
  },

  sendInvitation: async (
  tripId,
  receiverId
) => {

  const response =
    await api.post(
      "/notification/send-invitation",
      {
        tripId,
        receiverId,
      }
    );

  return response.data;
},

markRead:
async (notificationId) => {

  const response =
    await api.patch(
      `/notification/mark-read/${notificationId}`
    );

  return response.data;
},

markAllRead:
async () => {

  const response =
    await api.patch(
      "/notification/mark-all-read"
    );

  return response.data;
},
};