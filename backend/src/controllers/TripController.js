import Trip from "../models/TripModel.js";
import User from "../models/UserModel.js";
import cloudinary from "../config/Cloudinary.js";
import Gallery from "../models/GalleryModel.js";
import Expense from "../models/ExpenseModel.js";
import Poll from "../models/PollModel.js";
import { Types } from "mongoose";
import Activity
from "../models/ActivityModel.js";

// CREATE TRIPS
export const createTrip = async (req, res) => {
    try {
        // Get request body
        const {
            title,
            destination,
            description,
            startDate,
            endDate
        } = req.body;

        // Validate fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Trip title cannot be empty"
            });
        }
        if (title.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Title must be atleast 2 characters"
            })
        }

        if (!destination || !destination.trim()) {
            return res.status(400).json({
                success: false,
                message: "Destination cannot be empty"
            });
        }
        if (destination.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Destination must be atleast 2 characters"
            })
        }

        if (!startDate) { // trim doesnt work for dates
            return res.status(400).json({
                success: false,
                message: "Start date is required"
            });
        }

        if (!endDate) {
            return res.status(400).json({
                success: false,
                message: "End date is required"
            });
        }

        // Date format validation

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (startDate !== undefined && !dateRegex.test(startDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid format for start date (YYYY-MM-DD)"
            })
        }
        if (endDate !== undefined && !dateRegex.test(endDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid format for end date (YYYY-MM-DD)"
            })
        }

        if (isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid start date"
            })
        }
        if (isNaN(new Date(endDate).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid end date"
            })
        }

        // Validate date (new Date is to convert from string to date)
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: "Starting date of trip cannot be after Ending date"
            });
        }
        // Create trip object
        const trip = await Trip.create({
            title,
            destination,
            description,
            startDate,
            endDate,
            createdBy: req.user._id,
            admins: [req.user._id],
            members: [req.user._id]
        });
        // Send response
        return res.status(201).json({
            success: true,
            message: "Trip created successfully!",
            trip
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
};

// GET ALL TRIPS BY ID
export const getAllTrips = async (req, res) => {
    try {
        // Get all trips which they are members of (not only created trips)
        // User is also member of created trips
        const trips = await Trip.find({
            members: req.user._id
        })
        return res.json({
            success: true,
            trips
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

// GET A SINGLE TRIP
export const getTrip = async (req, res) => {
    try {
        // Get trip id from url
        const { tripId } = req.params;
        // Validate
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Trip ID is required"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }
        // Check if trip exists
        const trip = await Trip.findById(
  tripId
)
.populate(
  "members",
  "name email profilePicture"
)
.populate(
  "admins",
  "name email profilePicture"
)


        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check if user is member of that trip
        const isMember = trip.members.some(
            member => member._id.toString() === req.user._id.toString()
        )

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this trip"
            })
        }
        // Send response
        return res.status(200).json({
            success: true,
            trip
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

// UPDATE A TRIP (Partial updates)

export const updateTrip = async (req, res) => {
    try {
        // Get updated request body
        const {
            tripId,
            title,
            destination,
            description,
            startDate,
            endDate
        } = req.body;
        // Validate trip id
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Trip ID cannot be empty"
            })
        }

        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }
        // Check if trip exists
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(400).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check authorization - allow to edit only by admins
        const isAdmin = trip.admins.some(
            admin => admin.toString() === req.user._id.toString()
        )
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can edit details of the trip"
            })
        }

        // Validate fields (only if provided in bodyi.e not undefined)
        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty"
            })
        }
        if (title !== undefined && title.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Title must be atleast 2 characters"
            })
        }
        if (destination !== undefined && !destination.trim()) {
            return res.status(400).json({
                success: false,
                message: "Destination cannot be empty"
            })
        }
        if (destination !== undefined && destination.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Destination must be atleast 2 characters"
            })
        }
        if (startDate !== undefined && !startDate.trim()) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be empty"
            });
        }

        if (endDate !== undefined && !endDate.trim()) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be empty"
            });
        }
        // Date format validation

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (startDate !== undefined && !dateRegex.test(startDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid format for start date (YYYY-MM-DD)"
            })
        }
        if (endDate !== undefined && !dateRegex.test(endDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid format for end date (YYYY-MM-DD)"
            })
        }

        // Date validation - Needed for wrong date inputs (2026-08-77)
        const newStartDate = startDate || trip.startDate;
        const newEndDate = endDate || trip.endDate;

        if (isNaN(new Date(newStartDate).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid start date"
            })
        }
        if (isNaN(new Date(newEndDate).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid end date"
            })
        }

        if (new Date(newStartDate) > new Date(newEndDate)) {
            return res.status(400).json({
                success: false,
                message: "Starting date cannot be after ending date"
            })
        }
        // Update in database only where it is modified, others remain same
        const updateData = {};
        if (title !== undefined)
            updateData.title = title
        if (destination !== undefined)
            updateData.destination = destination
        if (description !== undefined)
            updateData.description = description
        if (startDate !== undefined)
            updateData.startDate = startDate
        if (endDate !== undefined)
            updateData.endDate = endDate

        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            updateData,
            {
                returnDocument: "after", //Returns document after updating
                runValidators: true // Without this mongoose doesnt run validators for update
            }
        )
        // Send response
        return res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            trip: updatedTrip
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server side error"
        })
    }
}

export const deleteTrip = async (req, res) => {
    try {
        // Get trip ID from url
        const { tripId } = req.params;
        // Run validators for trip id
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter Trip ID"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check authorization - allow to delete only by admins
        const isAdmin = trip.admins.some(
            admin => admin.toString() === req.user._id.toString()
        )
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete the trip"
            })
        }
        // Delete
        const deletedTrip = await Trip.findByIdAndDelete(tripId);
        // Send response
        return res.status(200).json({
            success: true,
            message: "Trip deleted"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

// ADD MEMBER TO TRIP
export const addMember = async (req, res) => {
    try {
        // Get body
        const { tripId, email } = req.body;
        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter Trip ID"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid trip ID"
            })
        }

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter email"
            })
        }

        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            })
        }

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check if current user is member of the trip.
        const userIsMember = trip.members.some(
            member => member.toString() === req.user._id.toString()
        )
        if(!userIsMember) {
              return res.status(403).json({
                success: false,
                message: "You are not a member of this trip to add others"
            })
        }
        const isAdmin = trip.admins.some(
            admin => admin.toString() === req.user._id.toString()
        )
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can add members in the trip"
            })
        }
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        // Check if user is already a member
        const isMember = trip.members.some(
            member => member.toString() === existingUser._id.toString()
        )
        if (isMember) {
            return res.status(400).json({
                success: false,
                message: "User is already a member of this trip"
            })
        }
        // If not add user to trip as member & save in database
        trip.members.push(existingUser._id)
        await trip.save();
        // Send response
        return res.status(200).json({
            success: true,
            message: "User added to trip as a member"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

// GET ALL MEMBERS OF A TRIP
export const getMembers = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Please enter Trip ID"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid Trip ID"
            })
        }
        // Without populate details of members is not shown but only object ids of members
        // We dont need to see passwords, just fetch name and email using populate (id also)
        const trip = await Trip.findById(tripId).populate("members", "name email")
        // Check if trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Only members of the trip can view all members 
        const isMember = trip.members.some(
            member => member._id.toString() === req.user._id.toString()
        )
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not the member of this trip to view all members"
            })
        }
        // Send response
        return res.status(200).json({
            success: true,
            members: trip.members,
            count: trip.members.length // Shows number of members in the trip
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

//REMOVE MEMBER FROM THE TRIP
export const removeMember = async (req, res) => {
    try {
        const { tripId, memberId } = req.params;
        // Validate fields
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "Trip ID cannot be empty"
            })
        }
        if (!memberId) {
            return res.status(400).json({
                success: false,
                message: "Member ID cannot be empty"
            })
        }
        if (!Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid trip ID"
            })
        }
        if (!Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid member ID"
            })
        }
        // Find trip
        const trip = await Trip.findById(tripId);
        // Check if trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        const isAdmin = trip.admins.some(
            admin => admin.toString() === req.user._id.toString()
        )
        if (!isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Only admins can remove members from trip"
            })
        }
        // Check if target user to remove is member of the trip
        const isMember = trip.members.some(
            member =>
                member.toString() === memberId
        )
        if (!isMember) {
            return res.status(400).json({
                success: false,
                message: "User is not a member of this trip"
            })
        }
        // Creator cannot be removed only if
// creator is still an active member of the trip

if (
    trip.createdBy &&
    trip.createdBy.toString() === memberId
) {

    const creatorStillMember =
        trip.members.some(
            member =>
                member.toString() ===
                trip.createdBy.toString()
        );

    if (creatorStillMember) {
        return res.status(400).json({
            success: false,
            message:
                "Creator of the trip cannot be removed"
        });
    }
}
        // Admin cant remove themselves - leave trip is preferred
        if(memberId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot remove yourself but can leave the group"
            })
        }
        // Remove from members array
        trip.members.pull(memberId);
        // If target user is admin, remove from admin array also
        trip.admins.pull(memberId);
        // Save in database
        await trip.save();
        // Send response
        return res.status(200).json({
            success: true,
            message: "Member has been removed from the trip"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message: "Server side error"
        })
    }
}

// MAKE MEMBER AS ADMIN (partial update - PATCH)
export const addAdmin = async(req,res) => {
    try {
    // Get trip id and member id from body
    const {tripId,memberId} = req.body;
    // Validate fields
    if(!tripId) {
      return res.status(400).json({
            success : false,
            message: "Please enter trip ID"
        })
    }
    if(!Types.ObjectId.isValid(tripId)) {
         return res.status(400).json({
            success : false,
            message: "Please enter valid trip ID"
        })
    }
    if(!memberId) {
      return res.status(400).json({
            success : false,
            message: "Please enter member ID"
        })
    }
    if(!Types.ObjectId.isValid(memberId)) {
         return res.status(400).json({
            success : false,
            message: "Please enter valid member ID"
        })
    }
    // Find trip
    const trip = await Trip.findById(tripId);
    // Check if trip exists
    if(!trip) {
      return res.status(404).json({
            success : false,
            message: "Trip not found"
        })
    }
    // Check if current user is admin
    const isAdmin = trip.admins.some(
        admin => admin.toString() === req.user._id.toString()
    )
     if(!isAdmin) {
      return res.status(400).json({
            success : false,
            message: "Only admins can make other members as admin"
        })
    }
    // Admin cannot make himself as admin
    if(memberId === req.user._id.toString()) {
        return res.status(400).json({
            success : false,
            message : "You are already an admin"
        })
    }
    // Check if target user is member
    const isMember = trip.members.some(
        member => member.toString() === memberId  // Returns true or false
    )
     if(!isMember) {
      return res.status(404).json({
            success : false,
            message: "User is not a member of this trip"
        })
    }
    // Check if target user is not admin
     const memberIsAdmin = trip.admins.some(
        admin => admin.toString() === memberId
    )
     if(memberIsAdmin) {
      return res.status(403).json({
            success : false,
            message: "Member is already an admin"
        })
    }
    // Add to admin array
    trip.admins.push(memberId)
    // Save to database
    await trip.save();
    // Send response
       return res.status(200).json({
            success : true,
            message: "Member added as admin successfully"
        })

} catch(error)  {
    console.log(error);
     return res.status(500).json({
            success : false,
            message: "Server side error"
        })
}
}

export const removeAdmin = async(req,res) => {
    try {
    // Get tripId, adminId to  be removed from url
    const {tripId,adminId} = req.params;
    // Validate fields
    if(!tripId) {
         return res.status(400).json({
            success : false,
            message: "Trip ID is required"
        })
    }
    if(!adminId) {
         return res.status(400).json({
            success : false,
            message: "Admin ID is required"
        })
    }
    if(!Types.ObjectId.isValid(tripId)) {
         return res.status(400).json({
            success : false,
            message: "Please enter valid Trip ID"
        })
    }
    if(!Types.ObjectId.isValid(adminId)) {
         return res.status(400).json({
            success : false,
            message: "Please enter valid Admin ID"
        })
    }
    // Check if trip exists
    const trip = await Trip.findById(tripId);
     if(!trip)  {
         return res.status(404).json({
            success : false,
            message: "Trip not found"
        })
    }

    // Check if current user is admin - then only we can remove others as admin
    const userIsAdmin = trip.admins.some(
        admin => admin.toString() === req.user._id.toString()
    )
    if(!userIsAdmin)  {
         return res.status(400).json({
            success : false,
            message: "Only admin can remove member from admin access"
        })
    }
    // Check if target user is also admin - then only they can be removed as admin 
    // This checks if they are member of trip also
      const isAdmin = trip.admins.some(
        admin => admin.toString() === adminId
    )
    if(!isAdmin)  {
         return res.status(400).json({
            success : false,
            message: "User is not an admin. Cant remove admin access"
        })
    }
    // Check if target user is creator
      if(adminId === trip.createdBy.toString()) {
          return res.status(400).json({
            success : false,
            message: "Cant remove creator of the trip as admin"
        })
      }
    // Remove as admin
    trip.admins.pull(adminId);
    // Save in database
    await trip.save();
    // Send response
    return res.status(200).json({
            success : true,
            message: "User removed as admin"
        })

    } catch(error)  {
    console.log(error);
     return res.status(500).json({
            success : false,
            message: "Server side error"
        })
}
}

export const leaveTrip = async(req,res) => {
    try {
     // Get trip ID from params
     const {tripId} = req.params;

     // validate trip ID
       if(!tripId) {
         return res.status(400).json({
            success : false,
            message: "Trip ID is required"
        })
    }
      if(!Types.ObjectId.isValid(tripId)) {
         return res.status(400).json({
            success : false,
            message: "Please enter valid Trip ID"
        })
    }
     // Check if trip exists
    const trip = await Trip.findById(tripId);
     if(!trip)  {
         return res.status(404).json({
            success : false,
            message: "Trip not found"
        })
    }
    // Check user is member of the trip - only they can leave
    const isMember = trip.members.some(
        member => member.toString() === req.user._id.toString()
    )
    if(!isMember)  {
         return res.status(403).json({
            success : false,
            message: "You are not a member of this trip"
        })
    }
    // Check if user is admin
    const isAdmin = trip.admins.some(
        admin => admin.toString() === req.user._id.toString()
    );
    // If admin is only one, they must make another as admin and leave
    if(isAdmin && trip.admins.length === 1){
         return res.status(400).json({
            success : false,
            message: "Assign another admin before leaving the trip"
        })
    }
    // If admin - remove from admins array
    if(isAdmin) {
    trip.admins.pull(req.user._id);
    }
    // Remove from members array
    trip.members.pull(req.user._id);

    // Creator loses creator protection after leaving the trip

if (
    trip.createdBy &&
    trip.createdBy.toString() ===
    req.user._id.toString()
) {
    trip.createdBy = null;
}
    // Save in database
    await trip.save();

    await Activity.create({
  trip: trip._id,
  user: req.user._id,
  type: "member_left",
  message:
    `${req.user.name} left the trip`
});
   // Send response
    return res.status(200).json({
            success : true,
            message: "You left the trip"
    })
    } 
    catch(error) {
    console.log(error);
     return res.status(500).json({
            success : false,
            message: "Server side error"
    })
}
}

export const updateTripCoverImage =
async (req, res) => {

    try {

        const { tripId } =
            req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message:
                    "Trip ID is required"
            });
        }

        if (
            !Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter valid Trip ID"
            });
        }

        // Validate image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload cover image"
            });
        }

        // Find trip
        const trip =
            await Trip.findById(
                tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found"
            });
        }

        // Only admin can update
        const isAdmin =
            trip.admins.some(
                admin =>
                    admin.toString() ===
                    req.user._id.toString()
            );

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "Only admins can update cover image"
            });
        }

        // Upload image
        const result =
            await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder:
                        "group-travel-covers"
                }
            );

        trip.coverImage =
            result.secure_url;

        await trip.save();

        return res.status(200).json({
            success: true,
            message:
                "Cover image updated successfully",
            coverImage:
                trip.coverImage
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const getTripStatistics =
async (req, res) => {

    try {

        const { tripId } =
            req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message:
                    "Trip ID is required"
            });
        }

        if (
            !Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter valid Trip ID"
            });
        }

        // Find trip
        const trip =
            await Trip.findById(
                tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found"
            });
        }

        // Member check
        const isMember =
            trip.members.some(
                member =>
                    member.toString() ===
                    req.user._id.toString()
            );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message:
                    "Only trip members can view statistics"
            });
        }

        const photosCount =
            await Gallery.countDocuments({
                tripId
            });

        const pollsCount =
            await Poll.countDocuments({
                tripId
            });

        const expenses =
            await Expense.find({
                tripId
            });

        let totalExpenseAmount =
            0;

        expenses.forEach(
            expense => {

                expense.payers.forEach(
                    payer => {
                        totalExpenseAmount +=
                            payer.amount;
                    }
                );
            }
        );

        // Budget details
const budget =
    trip.budget || 0;

const remainingBudget =
    Math.max(
        0,
        budget -
        totalExpenseAmount
    );

let budgetUsedPercentage =
    0;

if (budget > 0) {

    budgetUsedPercentage =
        Number(
            (
                totalExpenseAmount /
                budget
            ) * 100
        ).toFixed(2);
}

const isBudgetExceeded =
    budget > 0 &&
    totalExpenseAmount > budget;

// Trip status
const currentDate =
    new Date();

let tripStatus;

if (
    currentDate <
    trip.startDate
) {

    tripStatus =
        "Upcoming";

}
else if (
    currentDate >
    trip.endDate
) {

    tripStatus =
        "Completed";

}
else {

    tripStatus =
        "Ongoing";
}

        return res.status(200).json({
    success: true,

    statistics: {

        members:
            trip.members.length,

        photos:
            photosCount,

        polls:
            pollsCount,

        expenses:
            expenses.length,

        totalExpenseAmount,

        budget,

        remainingBudget,

        budgetUsedPercentage,

        isBudgetExceeded,

        tripStatus,
        startDate: trip.startDate,
endDate: trip.endDate,
    }
});
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};

export const searchTrips =
async (req, res) => {

    try {

        const {
            q
        } = req.query;

       const searchText =
    q?.trim() || "";

        const trips =
            await Trip.find({

                members:
                    req.user._id,

                $or: [
                    {
                       title: {
    $regex: searchText,
    $options: "i"
}
                    },
                    {
                       destination: {
    $regex: searchText,
    $options: "i"
}
                    }
                ]
            })
            .populate(
                "members",
                "name profilePicture"
            )
            .sort({
                startDate: 1
            });

        return res.status(200).json({
            success: true,
            count:
                trips.length,
            trips
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Server side error"
        });
    }
};