import express from "express";

import {
    sendInvitation,
    getNotifications,
    acceptInvitation,
    rejectInvitation,
    getUnreadNotificationCount,
markNotificationRead,
markAllNotificationsRead
}
from "../controllers/NotificationController.js";

import {
    verifyToken
}
from "../middlewares/AuthMiddleware.js";

export const notificationApp =
    express.Router();

notificationApp.post(
    "/send-invitation",
    verifyToken,
    sendInvitation
);

notificationApp.get(
    "/get-notifications",
    verifyToken,
    getNotifications
);

notificationApp.patch(
    "/accept-invitation",
    verifyToken,
    acceptInvitation
);

notificationApp.patch(
    "/reject-invitation",
    verifyToken,
    rejectInvitation
);
notificationApp.get(
    "/unread-count",
    verifyToken,
    getUnreadNotificationCount
);

notificationApp.patch(
    "/mark-read/:notificationId",
    verifyToken,
    markNotificationRead
);

notificationApp.patch(
    "/mark-all-read",
    verifyToken,
    markAllNotificationsRead
);