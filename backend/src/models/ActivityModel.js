import { Schema, model }
from "mongoose";

const activitySchema =
new Schema(
{
  trip: {
    type:
      Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  user: {
    type:
      Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: [
      "member_joined",
      "itinerary_added",
      "itinerary_updated",
      "expense_added",
      "expense_settled",
      "poll_created",
      "gallery_uploaded",
      "itinerary_deleted",
      "member_left"
    ],
    required: true
  },

  message: {
    type: String,
    required: true
  }

},
{
  timestamps: true
}
);

export default model(
  "Activity",
  activitySchema
);