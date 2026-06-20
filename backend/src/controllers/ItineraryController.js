import Itinerary from "../models/ItineraryModel.js";
import Trip from "../models/TripModel.js"
import { isTripAdmin, isTripMember } from "../utils/TripHelpers.js";
import { Types } from "mongoose";
import Activity from "../models/ActivityModel.js"

export const createItinerary = async (req, res) => {
    try {
        // Get details from body
        // No need for status as we can take default as upcoming
        const {
            tripId,
            title,
            description,
            location,
            dateTime
        } = req.body;

        // Validate fields
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }
        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter title"
            })
        }
        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Title must be atleast 3 characters"
            })
        }
        // Validate location
        if (!location || !location.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter location"
            })
        }
        // Validate date and time
        if (!dateTime) {
            return res.status(400).json({
                success: false,
                message: "Please enter date and time"
            });
        }
        if (isNaN(new Date(dateTime))) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid date and time"
            });
        }
        // Find Trip
        const trip = await Trip.findById(tripId);

        // Check if Trip Exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Check if User is Admin
        if (!isTripAdmin(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only admins can create itinerary items"
            });
        }
        // Check if itinerary date is  within trip dates
        const itineraryDate = new Date(dateTime);

        if (isNaN(itineraryDate.getTime())) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid date and time"
            });
        }
        const isTimeSpecified = dateTime.includes("T");

        const tripStart = new Date(trip.startDate);

        tripStart.setHours(0, 0, 0, 0);

        const tripEnd = new Date(trip.endDate);

        tripEnd.setHours(23, 59, 59, 999);

        if (itineraryDate < tripStart || itineraryDate > tripEnd) {
            return res.status(400).json({
                success: false,
                message: "Itinerary dates must be within trip dates"
            })
        }
        // Create itinerary
        const itinerary = await Itinerary.create({
            tripId,
            title: title.trim(),
            description: description?.trim() || "",
            location: location.trim(),
            dateTime: itineraryDate,
            isTimeSpecified,
            createdBy: req.user._id
        })

        await Activity.create({
  trip: tripId,
  user: req.user._id,
  type: "itinerary_added",
  message:
    `${req.user.name} added "${title}"`
});
        // Send Response
        return res.status(201).json({
            success: true,
            message: "Itinerary created successfully",
            itinerary
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}


export const getItineraries = async (req, res) => {
    try {
        // Get trip id 
        const { tripId } = req.params;
        //  Validate trip Id
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter trip ID"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }
        // Find Trip
        const trip = await Trip.findById(tripId);

        // Check if Trip Exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // Check if logged-in user is trip member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only members of the trip can view itineraries"
            });
        }

        // Get all itineraries
        const allItineraries = await Itinerary.find({ tripId })
            .populate("createdBy", "name profilePicture")
            .populate("updatedBy", "name profilePicture")
            .sort({ dateTime: 1 })

            const now = new Date();

const enrichedItineraries =
  allItineraries.map(
    (item, index) => {

      let needsReview = false;

      if (
        item.status === "Upcoming" &&
        new Date(item.dateTime) <= now
      ) {

        const nextActivity =
          allItineraries[index + 1];

        if (

          !nextActivity ||

          new Date(
            nextActivity.dateTime
          ) <= now

        ) {

          needsReview = true;

        }

      }

      return {
        ...item.toObject(),
        needsReview
      };

    }
  );
        // Send response
       return res.status(200).json({
    success: true,
    allItineraries:
      enrichedItineraries
})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const getSingleItinerary = async (req, res) => {
    try {
        const { itineraryId } = req.params;
        //  Validate itinerary Id
        if (!itineraryId) {
            return res.status(400).json({
                success: false,
                message: "Please enter itinerary ID"
            })
        }
        if (!Types.ObjectId.isValid(itineraryId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid itinerary ID"
            })
        }
        // Find itinerary
        const itinerary = await Itinerary.findById(itineraryId)
            .populate("createdBy", "name")
            .populate("updatedBy", "name")
        // Check if itinerary exists
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            })
        }
        //Find trip 
        const trip = await Trip.findById(itinerary.tripId);
        // Check if Trip Exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // Check if logged-in user is trip member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only members of the trip can view itineraries"
            });
        }
        // Send response
        return res.status(200).json({
            success: true,
            itinerary
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const updateItinerary = async (req, res) => {
    try {
        const {
            itineraryId,
            title,
            description,
            location,
            dateTime,
            status
        } = req.body;

        // Validate itinerary ID
        if (!itineraryId) {
            return res.status(400).json({
                success: false,
                message: "Please enter itinerary ID"
            });
        }

        if (!Types.ObjectId.isValid(itineraryId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid itinerary ID"
            });
        }

        // Find itinerary
        const itinerary = await Itinerary.findById(itineraryId);

        // Check if itinerary exists
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        // Find trip
        const trip = await Trip.findById(itinerary.tripId);

        
            const originalStatus =
  itinerary.status;


        // Check if user is admin
        if (!isTripAdmin(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only admins can update itinerary items"
            });
        }
        // Validate status - must be those 3 not any other random text
        if (
  status &&
  ![
    "Upcoming",
    "Completed",
    "Cancelled"
  ].includes(status)
) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        let wasRescheduled =
  false;
        // Validate dateTime if provided
        if (dateTime) {
            const itineraryDate = new Date(dateTime);

            if (isNaN(itineraryDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid date and time"
                });
            }

            if (
                itineraryDate < trip.startDate ||
                itineraryDate > trip.endDate
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Itinerary date must be within trip dates"
                });
            }

            itinerary.dateTime = itineraryDate;
          if (
  (
    originalStatus === "Completed" ||
    originalStatus === "Cancelled"
  ) &&
  itineraryDate > new Date()
) {

  itinerary.status =
    "Upcoming";

  wasRescheduled =
    true;

}


            itinerary.isTimeSpecified =
                dateTime.includes("T");
        }

        // Update fields only if provided
        if (title !== undefined) {
            itinerary.title = title.trim();
        }

        if (description !== undefined) {
            itinerary.description = description.trim();
        }

        if (location !== undefined) {
            itinerary.location = location.trim();
        }

       const previousStatus =
  originalStatus;
if (
  status !== undefined &&
  status !== previousStatus
) {

  itinerary.status = status;

}

        // The logged in user updates it. We need name 
        itinerary.updatedBy = req.user._id;

        // Save
        await itinerary.save();

        if (status === "Completed") {

  await Itinerary.updateMany(

    {
      tripId: itinerary.tripId,

      dateTime: {
        $lt: itinerary.dateTime
      },

      status: "Upcoming"
    },

    {
      $set: {
        status: "Completed"
      }
    }

  );

}

      if (wasRescheduled) {

  await Activity.create({
    trip: itinerary.tripId,
    user: req.user._id,
    type: "itinerary_updated",
    message:
      `${req.user.name} rescheduled "${itinerary.title}"`
  });

}

else if (
  status !== undefined &&
  status !== previousStatus
) {

  await Activity.create({
    trip: itinerary.tripId,
    user: req.user._id,
    type: "itinerary_status_updated",
    message:
      `${req.user.name} marked "${itinerary.title}" as ${status}`
  });

}

else {

  await Activity.create({
    trip: itinerary.tripId,
    user: req.user._id,
    type: "itinerary_updated",
    message:
      `${req.user.name} updated "${itinerary.title}"`
  });

}

        // Response
        return res.status(200).json({
            success: true,
            message: "Itinerary updated successfully",
            itinerary
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const deleteItinerary = async (req, res) => {
    try {
        const { itineraryId } = req.params;
        //  Validate itinerary Id
        if (!itineraryId) {
            return res.status(400).json({
                success: false,
                message: "Please enter itinerary ID"
            })
        }
        if (!Types.ObjectId.isValid(itineraryId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid itinerary ID"
            })
        }
        // Find itinerary
        const itinerary = await Itinerary.findById(itineraryId);
        // Check if itinerary exists
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            })
        }
        //Find trip 
        const trip = await Trip.findById(itinerary.tripId);
        // Check if Trip Exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // Check if logged-in user is trip member
        if (!isTripAdmin(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only admins of the trip can delete itineraries"
            });
        }

        const tripId =
  itinerary.tripId;

    
        // Delete itinerary
        await Itinerary.findByIdAndDelete(itineraryId);

   await Activity.create({
  trip: tripId,
  user: req.user._id,
  type: "itinerary_deleted",
  message:
    `${req.user.name} deleted "${itinerary.title}"`
});

        // Send response
        return res.status(200).json({
            success: true,
            message: "Itinerary deleted"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}