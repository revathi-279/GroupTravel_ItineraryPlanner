import { Types } from "mongoose";
import Gallery from "../models/GalleryModel.js";
import { getTrip, isTripMember, isTripAdmin } from "../utils/TripHelpers.js";
import cloudinary from "../config/Cloudinary.js";
import Activity
from "../models/ActivityModel.js";

export const uploadPhoto = async (req, res) => {
    try {

        const {
            tripId
        } = req.body;

        let {
            captions
        } = req.body;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            });
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            });
        }

        // Validate photos
        if (
            !req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload at least one photo"
            });
        }

        // Find trip
        const trip = await getTrip(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Check member
        if (
            !isTripMember(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only trip members can upload photos"
            });
        }

        // Convert captions to array
        if (!captions) {
            captions = [];
        }

        if (!Array.isArray(captions)) {
            captions = [captions];
        }

        const uploadedPhotos = [];

        // Upload each photo
        for (
            let i = 0;
            i < req.files.length;
            i++
        ) {

            const file =
                req.files[i];

         let result;

try {

  result =
    await cloudinary.uploader.upload(
      file.path,
      {
        folder:
          "group-travel-gallery"
      }
    );



} catch (error) {

  console.log(
    "Cloudinary Upload Error:"
  );

  console.log(error);

  throw error;
}

const photo =
    await Gallery.create({
                    tripId,
                    imageUrl:
                        result.secure_url,
                    caption:
                        captions[i]?.trim() || "",
                    uploadedBy:
                        req.user._id
                });

                await Activity.create({
  trip: tripId,
  user: req.user._id,
  type: "gallery_uploaded",
  message:
    `${req.user.name} uploaded a photo`
});

            const populatedPhoto =
                await Gallery.findById(
                    photo._id
                )
                    .populate(
                        "uploadedBy",
                        "name profilePicture"
                    );

            uploadedPhotos.push(
                populatedPhoto
            );
        }

        return res.status(201).json({
            success: true,
            message:
                "Photos uploaded successfully",
            count:
                uploadedPhotos.length,
            photos:
                uploadedPhotos
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const getGalleryPhotos = async (req, res) => {
    try {

        const { tripId } = req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            });
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            });
        }

        // Find trip
        const trip = await getTrip(tripId);

        // Check trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Check member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message:
                    "Only trip members can view gallery"
            });
        }

        // Get photos
        const photos =
            await Gallery.find({
                tripId
            })
                .populate(
                    "uploadedBy",
                    "name profilePicture"
                )
                .populate(
                    "reactions.user",
                    "name"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            count:
                photos.length,
            photos
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const deletePhoto = async (req, res) => {
    try {

        const { photoId } =
            req.params;

        // Validate photo ID
        if (!photoId) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter photo ID"
            });
        }

        if (
            !Types.ObjectId.isValid(
                photoId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter valid photo ID"
            });
        }

        // Find photo
        const photo =
            await Gallery.findById(
                photoId
            );

        // Check photo exists
        if (!photo) {
            return res.status(404).json({
                success: false,
                message:
                    "Photo not found"
            });
        }

        // Find trip
        const trip =
            await getTrip(
                photo.tripId
            );

        // Check uploader
        const isUploader =
            photo.uploadedBy.toString() ===
            req.user._id.toString();

        // Check admin
        const isAdmin =
            isTripAdmin(
                trip,
                req.user._id
            );

        if (
            !isUploader &&
            !isAdmin
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only uploader or trip admin can delete photo"
            });
        }

        await Gallery.findByIdAndDelete(
            photoId
        );

        return res.status(200).json({
            success: true,
            message:
                "Photo deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const reactToPhoto = async (req, res) => {
    try {

        const {
            photoId,
            emoji
        } = req.body;

        // Validate photo ID
        if (!photoId) {
            return res.status(400).json({
                success: false,
                message: "Please enter photo ID"
            });
        }

        if (!Types.ObjectId.isValid(photoId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid photo ID"
            });
        }

        // Validate emoji
        const allowedEmojis = [
            "❤️",
            "😍",
            "🔥",
            "👍"
        ];

        if (
            !emoji ||
            !allowedEmojis.includes(
                emoji
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid reaction emoji"
            });
        }

        // Find photo
        const photo =
            await Gallery.findById(
                photoId
            );

        // Check photo exists
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        // Find existing reaction
        const existingReaction =
            photo.reactions.find(
                reaction =>
                    reaction.user.toString() ===
                    req.user._id.toString()
            );

        // Check existing reaction
if (existingReaction) {

    // Same emoji clicked again
    if (
        existingReaction.emoji ===
        emoji
    ) {

        photo.reactions =
            photo.reactions.filter(
                reaction =>
                    reaction.user.toString() !==
                    req.user._id.toString()
            );

    } else {

        // Change reaction
        existingReaction.emoji =
            emoji;
    }

} else {

    // Add reaction
    photo.reactions.push({
        user:
            req.user._id,
        emoji
    });
}

        // Save photo
        await photo.save();

        // Populate users
        const populatedPhoto =
            await Gallery.findById(
                photoId
            )
                .populate(
                    "uploadedBy",
                    "name"
                )
                .populate(
                    "reactions.user",
                    "name"
                );

        return res.status(200).json({
            success: true,
            message:
                "Reaction updated successfully",
            photo:
                populatedPhoto
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const updateCaption = async (req, res) => {
    try {

        const {
            photoId,
            caption
        } = req.body;

        if (!photoId) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter photo ID"
            });
        }

        if (
            !Types.ObjectId.isValid(
                photoId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter valid photo ID"
            });
        }

        const photo =
            await Gallery.findById(
                photoId
            );

        if (!photo) {
            return res.status(404).json({
                success: false,
                message:
                    "Photo not found"
            });
        }

        const trip =
            await getTrip(
                photo.tripId
            );

        const isUploader =
            photo.uploadedBy.toString() ===
            req.user._id.toString();

        const isAdmin =
            isTripAdmin(
                trip,
                req.user._id
            );

        if (
            !isUploader &&
            !isAdmin
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only uploader or trip admin can edit caption"
            });
        }

        photo.caption =
            caption?.trim() || "";

        await photo.save();

        const populatedPhoto =
            await Gallery.findById(
                photoId
            )
                .populate(
                    "uploadedBy",
                    "name profilePicture"
                );

        return res.status(200).json({
            success: true,
            message:
                "Caption updated successfully",
            photo:
                populatedPhoto
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};