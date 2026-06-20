import {
  Schema,
  model
} from "mongoose";

const settlementSchema =
new Schema({

  tripId: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "AwaitingConfirmation",
      "Settled"
    ],
    default: "Pending"
  }

},
{
  timestamps: true
});

export default model(
  "Settlement",
  settlementSchema
);