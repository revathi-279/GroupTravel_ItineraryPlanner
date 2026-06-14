import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {

  try {
    // Get token from cookies
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Please login" })
    };
    // Verify if token is genuine using secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Find authenticated user
    const user = await User.findById(decodedToken.id);
    // Attach user to request 
    req.user = user;
    // Continue  request
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
}