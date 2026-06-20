import { api } from "./api";

export const authService = {

  register: async (data) =>
    (await api.post(
      "/auth/register",
      data
    )).data,

  login: async (data) =>
    (await api.post(
      "/auth/login",
      data
    )).data,

  getProfile: async () =>
    (await api.get(
      "/auth/profile"
    )).data,

  logout: async () =>
    (await api.post(
      "/auth/logout"
    )).data,

    updateProfile: async (data) =>
  (
    await api.patch(
      "/auth/update-profile",
      data
    )
  ).data,

updateProfilePicture:
async (formData) =>
  (
    await api.patch(
      "/auth/update-profile-picture",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )
  ).data,

  updateProfile:
async (data) =>
(
  await api.patch(
    "/auth/update-profile",
    data
  )
).data,

removeProfilePicture:
async () =>
(
  await api.patch(
    "/auth/remove-profile-picture"
  )
).data,

deleteAccount:
async () =>
  (
    await api.delete(
      "/auth/delete-account"
    )
  ).data,
};