import express from "express";

import {
    searchUsers
}
from "../controllers/UserController.js";

import {
    verifyToken
}
from "../middlewares/AuthMiddleware.js";

export const userApp =
    express.Router();

userApp.get(
    "/search",
    verifyToken,
    searchUsers
);