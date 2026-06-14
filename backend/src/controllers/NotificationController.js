import { Types } from "mongoose";
import Notification from "../models/NotificationModel.js";
import Trip from "../models/TripModel.js";
import User from "../models/UserModel.js";
import Activity
from "../models/ActivityModel.js";

export const sendInvitation =
async (req, res) => {

    try {

        const {
            tripId,
            receiverId
        } = req.body;

        // Validate IDs
        if (
            !tripId ||
            !receiverId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Trip ID and Receiver ID are required"
            });
        }

        if (
            !Types.ObjectId.isValid(tripId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Trip ID"
            });
        }

        if (
            !Types.ObjectId.isValid(
                receiverId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Receiver ID"
            });
        }

        const trip =
            await Trip.findById(
                tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found"
            });
        }

        // Only admin can invite
        const isAdmin =
            trip.admins.some(
                admin =>
                    admin.toString() ===
                    req.user._id.toString()
            );

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "Only admins can invite users"
            });
        }

        // Already member?
        const alreadyMember =
            trip.members.some(
                member =>
                    member.toString() ===
                    receiverId
            );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message:
                    "User is already a member"
            });
        }

        // Existing pending invite?
        const existingInvite =
            await Notification.findOne({
                receiver:
                    receiverId,
                tripId,
                type:
                    "trip_invitation",
                status:
                    "pending"
            });

        if (existingInvite) {
            return res.status(400).json({
                success: false,
                message:
                    "Invitation already sent"
            });
        }

        const notification =
            await Notification.create({
                receiver:
                    receiverId,

                sender:
                    req.user._id,

                tripId,

                type:
                    "trip_invitation",

                message:
                    `${req.user.name} invited you to join ${trip.title}`,

                status:
                    "pending"
            });

            await Activity.create({
  trip: trip._id,
  user: req.user._id,
  type: "member_joined",
  message:
    `${req.user.name} joined the trip`
});

        return res.status(201).json({
            success: true,
            message:
                "Invitation sent successfully",
            notification
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

export const getNotifications =
async (req, res) => {

    try {

        const notifications =
            await Notification.find({
                receiver:
                    req.user._id
            })
            .populate(
                "sender",
                "name email profilePicture"
            )
            .populate(
                "tripId",
                "title coverImage"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count:
                notifications.length,
            notifications
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

export const acceptInvitation =
async (req, res) => {

    try {

        const {
            notificationId
        } = req.body;

        if (
            !notificationId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Notification ID is required"
            });
        }

        const notification =
            await Notification.findById(
                notificationId
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found"
            });
        }

        if (
            notification.receiver.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized"
            });
        }

        if (
            notification.status !==
            "pending"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invitation already processed"
            });
        }

        const trip =
            await Trip.findById(
                notification.tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found"
            });
        }

        const alreadyMember =
    trip.members.some(
        member =>
            member.toString() ===
            req.user._id.toString()
    );

if (!alreadyMember) {
    trip.members.push(
        req.user._id
    );
}

        await trip.save();

        notification.status =
            "accepted";

        notification.isRead =
            true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message:
                "Invitation accepted"
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

export const rejectInvitation =
async (req, res) => {

    try {

        const {
            notificationId
        } = req.body;

        const notification =
            await Notification.findById(
                notificationId
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found"
            });
        }

        if (
            notification.receiver.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized"
            });
        }

        notification.status =
            "rejected";

        notification.isRead =
            true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message:
                "Invitation rejected"
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

export const getUnreadNotificationCount =
async (req, res) => {

    try {

        const unreadCount =
            await Notification.countDocuments({
                receiver:
                    req.user._id,

                isRead:
                    false
            });

        return res.status(200).json({
            success: true,
            unreadCount
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

export const markNotificationRead =
async (req, res) => {

    try {

        const {
            notificationId
        } = req.params;

        if (
            !notificationId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Notification ID is required"
            });
        }

        if (
            !Types.ObjectId.isValid(
                notificationId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid notification ID"
            });
        }

        const notification =
            await Notification.findById(
                notificationId
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found"
            });
        }

        if (
            notification.receiver.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized"
            });
        }

        notification.isRead =
            true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message:
                "Notification marked as read"
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

export const markAllNotificationsRead =
async (req, res) => {

    try {

        await Notification.updateMany(
            {
                receiver:
                    req.user._id,

                isRead:
                    false
            },
            {
                isRead:
                    true
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "All notifications marked as read"
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