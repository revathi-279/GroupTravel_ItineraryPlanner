import { Schema, model } from "mongoose";

const tripSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "Title should be atleast 2 character"]
        },
        destination: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Destination should be atleast 2 characters"]
        },
        description: {
            type: String,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
       createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
},
coverImage: {
    type: String,
    default: ""
},
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        budget: { // Budget limit for trip
            type: Number,
            min: [1, "Budget must be greater than 0"],
            default: null
        },
        aiInsights: {
  type: String,
  default: ""
},

aiInsightsUpdatedAt: {
  type: Date,
  default: null
},
    },
    
    {
        timestamps: true
    }
)

const Trip = model("Trip", tripSchema);

export default Trip;

//later we will add this
// members: [
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User"
//     },
//     joinedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }
// ]