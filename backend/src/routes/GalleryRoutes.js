import express from "express";

import { verifyToken }
from "../middlewares/AuthMiddleware.js";

import upload
from "../middlewares/Multer.js";

import {
    uploadPhoto,
    getGalleryPhotos,
    deletePhoto,
    reactToPhoto,
    updateCaption
}
from "../controllers/GalleryController.js";

export const galleryApp =
    express.Router();


// Upload Photos
galleryApp.post(
    "/upload-photo",
    verifyToken,
    upload.array("photos", 20),
    uploadPhoto
);


// Get Gallery Photos
galleryApp.get(
    "/get-photos/:tripId",
    verifyToken,
    getGalleryPhotos
);


// Delete Photo
galleryApp.delete(
    "/delete-photo/:photoId",
    verifyToken,
    deletePhoto
);


// React To Photo
galleryApp.patch(
    "/react-photo",
    verifyToken,
    reactToPhoto
);


// Update Caption
galleryApp.patch(
    "/update-caption",
    verifyToken,
    updateCaption
);