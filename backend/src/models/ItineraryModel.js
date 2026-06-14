import { Schema, model } from "mongoose";

const itinerarySchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Title must be atleast 3 characters"]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        location: {
            type: String,
            trim: true,
            required: true
        },
        dateTime: {
            type: Date,
            required: true
        },
        isTimeSpecified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["Upcoming", "Completed", "Cancelled"], //enum only allows values in array (no other text)
            default: "Upcoming"
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        updatedBy: {  
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Itinerary = model("Itinerary", itinerarySchema);

export default Itinerary;