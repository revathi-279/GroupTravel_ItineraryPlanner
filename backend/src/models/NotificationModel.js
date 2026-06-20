import { Schema, model } from "mongoose";

const notificationSchema =
new Schema(
{
    receiver: {
        type:
            Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
        type:
            Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tripId: {
        type:
            Schema.Types.ObjectId,
        ref: "Trip",
        default: null
    },

    type: {
        type: String,
        enum: [
            "trip_invitation",
            "expense",
            "poll",
            "gallery",
            "settlement"
        ],
        required: true
    },

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected"
        ],
        default: "pending"
    },

    isRead: {
        type: Boolean,
        default: false
    },
    settlementId: {
  type:
    Schema.Types.ObjectId,
  ref:
    "Settlement",
  default:
    null
},
},

{
    timestamps: true
}
);

const Notification =
model(
    "Notification",
    notificationSchema
);

export default Notification;