import express from "express";
import { registerUser } from "../controllers/AuthController.js";
import { loginUser } from "../controllers/AuthController.js";
import { getUserProfile,logoutUser, updateProfile,updateProfilePicture, deleteAccount} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload
from "../middlewares/Multer.js";

// Create router
export const authApp = express.Router();

// Register route
authApp.post("/register", registerUser);
// Login route
authApp.post("/login", loginUser);
// User Profile route
authApp.get("/profile", verifyToken, getUserProfile);
// Logout route
authApp.post("/logout",logoutUser);
// Update Profile
authApp.patch(
    "/update-profile",
    verifyToken,
    updateProfile
);

// Update Profile Picture
authApp.patch(
    "/update-profile-picture",
    verifyToken,
    upload.single("profilePicture"),
    updateProfilePicture
);

// Delete Account
authApp.delete(
    "/delete-account",
    verifyToken,
    deleteAccount
);
