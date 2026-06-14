import {Schema,Types,model} from "mongoose";

const gallerySchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            trim: true,
            default: ""
        },

        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reactions: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                emoji: {
                    type: String,
                    enum: ["❤️", "😍", "🔥", "👍"],
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default model("Gallery",gallerySchema);