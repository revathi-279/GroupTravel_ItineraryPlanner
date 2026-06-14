import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/Cloudinary.js";

// REGISTER USER
export const registerUser = async (req, res) => {
    try {

        // Get user details from body
        const { name, email, password } = req.body;

        // Validate name and email
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields should not be empty"
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                message: "Name must be atleast 2 characters"
            })
        }

        if (!email.includes("@") || !email.includes(".")) {
           return  res.status(400).json({
            message:"Please enter a valid email"
           })
        }
        if (password.trim().length == 0) {
            return res.status(400).json({
                message: "Password should not be only spaces",
            });
        }

        // After hashing validation of password can be wrong
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // If new user, hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user 
        const newUser = await User.create({
            name, email, password: hashedPassword
        });

        // Generate JWT cookie
        generateToken(res, newUser._id);

        // Send response
        res.status(200).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                  profilePicture:
        newUser.profilePicture
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server side error" });
    }
}

//LOGIN USER
export const loginUser = async (req, res) => {

    // Get details from request body
    const { email, password } = req.body;

    // Validation 
    if (!email || !password) {
        return res.status(400).json({
            message: "Any field must not be empty"
        })
    }
    // Backend finds user in db through email
    const existingUser = await User.findOne({ email });

    // Check if user exists in db
    if (!existingUser) {
        return res.status(400).json({ message: "Email doesn't exist" })
    }

    // Compare password with hashed password
    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
        return res.status(400).json({ message: "Password is incorrect" });
    }

    // Generate JWT cookie
    generateToken(res, existingUser._id);

    // Send response
    return res.status(200).json({
        message: "Login successful",
        user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
              profilePicture:
        existingUser.profilePicture
        }
    });
}

// GET USER DETAILS
export const getUserProfile = async (req, res) => {
    // No need to verify jwt since middleware already handled it
    res.status(200).json({
        message: "User Profile",
        payload: req.user
    })
}

// LOGOUT USER
export const logoutUser = async (req, res) => {

    // Clear token cookie
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    // Send response
    res.status(200).json({
        message: "Logged out successfully"
    });

};

export const updateProfile = async (req, res) => {

    try {

        const {
            name,
            email,
            currentPassword,
            newPassword
        } = req.body;

        const user =
            await User.findById(
                req.user._id
            );

        // Update name
        if (name !== undefined) {

            if (
                !name.trim() ||
                name.trim().length < 2
            ) {
                return res.status(400).json({
                    message:
                        "Name must be atleast 2 characters"
                });
            }

            user.name =
                name.trim();
        }

        // Update email
        if (email !== undefined) {

            if (
                !email.includes("@") ||
                !email.includes(".")
            ) {
                return res.status(400).json({
                    message:
                        "Please enter a valid email"
                });
            }

            const existingUser =
                await User.findOne({
                    email
                });

            if (
                existingUser &&
                existingUser._id.toString() !==
                user._id.toString()
            ) {
                return res.status(400).json({
                    message:
                        "Email already exists"
                });
            }

            user.email =
                email;
        }

        // Update password
        if (newPassword !== undefined) {

            if (!currentPassword) {
                return res.status(400).json({
                    message:
                        "Current password is required"
                });
            }

            const validPassword =
                await bcrypt.compare(
                    currentPassword,
                    user.password
                );

            if (!validPassword) {
                return res.status(400).json({
                    message:
                        "Current password is incorrect"
                });
            }

            if (
                newPassword.trim().length < 6
            ) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });
            }

            user.password =
                await bcrypt.hash(
                    newPassword,
                    12
                );
        }

        await user.save();

        return res.status(200).json({
            message:
                "Profile updated successfully",
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
                "Server side error"
        });
    }
};

export const updateProfilePicture =
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message:
                        "Please upload an image"
                });
            }

            const result =
                await cloudinary.uploader.upload(
                    req.file.path,
                    {
                        folder:
                            "group-travel-users"
                    }
                );

            const user =
                await User.findById(
                    req.user._id
                );

            user.profilePicture =
                result.secure_url;

            await user.save();

           return res.status(200).json({
    message:
        "Profile picture updated successfully",

    user
});

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message:
                    "Server side error"
            });
        }
    };

    export const deleteAccount =
    async (req, res) => {

        try {

            await User.findByIdAndDelete(
                req.user._id
            );

            res.cookie(
                "token",
                "",
                {
                    httpOnly: true,
                    expires:
                        new Date(0)
                }
            );

            return res.status(200).json({
                message:
                    "Account deleted successfully"
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message:
                    "Server side error"
            });
        }
    };