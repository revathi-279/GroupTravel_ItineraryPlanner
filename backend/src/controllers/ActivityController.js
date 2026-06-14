import Activity
from "../models/ActivityModel.js";

export const getTripActivities =
async (req,res) => {

  try {

    const activities =
      await Activity
        .find({
          trip:
            req.params.tripId
        })
        .populate(
          "user",
          "name profilePicture"
        )
        .sort({
          createdAt: -1
        })
        .limit(20);

    res.status(200).json({
      activities
    });

  } catch(error){

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });

  }
};