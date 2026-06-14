import { Schema, Types, model } from "mongoose";

const pollSchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },
        question: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Question must be atleast 3 characters"]
        },
        options: {
            type: [
                {
                    text: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    votes: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "User"
                        }
                    ]
                }
            ],
            validate: [
                {
                    validator: function (options) {
                        return options.length >= 2;
                    },
                    message: "Poll must have at least 2 options"
                },
                {
                    validator: function (options) {
                        return options.length <= 10;
                    },
                    message: "Poll can have at most 10 options"
                }
            ]
        },
        allowMultipleVotes: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }

)
const Poll = model("Poll", pollSchema);

export default Poll;