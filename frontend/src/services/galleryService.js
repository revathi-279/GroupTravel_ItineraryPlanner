import { api } from "./api";

export const galleryService = {

  getPhotos:
    async (tripId) => {

      const response =
        await api.get(
          `/gallery/get-photos/${tripId}`
        );

      return response.data;
    },

uploadPhotos:
async (formData) => {

  const response =
    await api.post(
      "/gallery/upload-photo",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
},

  deletePhoto:
    async (photoId) => {

      const response =
        await api.delete(
          `/gallery/delete-photo/${photoId}`
        );

      return response.data;
    },

  reactPhoto:
    async (data) => {

      const response =
        await api.patch(
          "/gallery/react-photo",
          data
        );

      return response.data;
    },

  updateCaption:
    async (data) => {

      const response =
        await api.patch(
          "/gallery/update-caption",
          data
        );

      return response.data;
    },

};