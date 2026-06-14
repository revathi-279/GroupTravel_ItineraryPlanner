import { Schema, Types, model } from "mongoose";

const expenseSchema = new Schema(
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
            minlength: [3, "Title must be at least 3 characters"]
        },

        payers: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                amount: {
                    type: Number,
                    required: true,
                    min: [1,"Amount must be greater than 0"]
                }
            }
        ],

        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Expense = model("Expense", expenseSchema);

export default Expense;