import { Types } from "mongoose";
import Poll from "../models/PollModel.js"
import Trip from "../models/TripModel.js"
import { isTripMember, isTripAdmin } from "../utils/TripHelpers.js";
import Activity
from "../models/ActivityModel.js";

// Create Poll
export const createPoll = async (req, res) => {
    try {
        // Get tripId, questions, options from body
        const { tripId, question, options,  allowMultipleVotes} = req.body;
        // Validate fields
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
        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question"
            })
        }
        // Options should be given as array only
        if (!options || !Array.isArray(options)) {
            return res.status(400).json({
                success: false,
                message: "Options must be an array"
            })
        }
        if (options.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Poll must have atleast 2 options"
            })
        }
        if (options.length > 10) {
            return res.status(400).json({
                success: false,
                message: "Poll can have atmost 10 options"
            })
        }
        // Find trip  
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check membership
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only members of the trip can create polls"
            })
        }
        // Remove extra spaces from options
        const trimmedOptions = options.map(
            option => option.trim()
        );

        // Check empty options
        const hasEmptyOptions = trimmedOptions.some(
            option => !option
        );

        if (hasEmptyOptions) {
            return res.status(400).json({
                success: false,
                message: "Poll options cannot be empty"
            })
        }
        // Check duplicate options
        const uniqueOptions = new Set(  // Set for unique options
            trimmedOptions.map(
                option => option.toLowerCase()  // lowercase is for Train === train
            )
        );
        if (uniqueOptions.size !== trimmedOptions.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate options are not allowed"
            })
        };
        // Convert options to schema format
        // Frontend sends array [...] but schema expects options to have text & votes array
        const formattedOptions = trimmedOptions.map(
            option => ({
                text: option,
                votes: []
            })
        )
        // Create poll
        const poll = await Poll.create({
            tripId,
            question: question.trim(),
            options: formattedOptions,
            createdBy: req.user._id,
            allowMultipleVotes: Boolean(allowMultipleVotes)
        });

        await Activity.create({
  trip: tripId,
  user: req.user._id,
  type: "poll_created",
  message:
    `${req.user.name} created a poll`
});
        // Response
        return res.status(200).json({
            success: true,
            message: "Poll created  successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const getAllPolls = async (req, res) => {
    try {

        // Get trip id from url
        const { tripId } = req.params;
        // Validate trip id
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
        // Check  if trip exists
        const trip = await Trip.findById(tripId);
        // Check if trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }
        // Check logged in user is member of the trip
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only members of the trip can view polls"
            })
        }
        // Get all polls - returns all polls which has given tripId
        // Created by has user object ids but we need names to display in frontend
        // Sort - newest to oldest
       const allPolls = await Poll.find({ tripId })
  .populate("createdBy", "name profilePicture")
  .populate("options.votes", "name profilePicture")
  .sort({ createdAt: -1 });
        // Send response
        return res.status(200).json({
            success: true,
            allPolls
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const getSinglePoll = async(req,res) =>  {
    try {
        // Get pollId fromm url
        const {pollId} = req.params;
        // Validate poll Id
        if (!pollId) {
            return res.status(400).json({
                success: false,
                message: "Please enter poll ID"
            })
        }
        if (!Types.ObjectId.isValid(pollId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid poll ID"
            })
        }
       //  Find poll
       // Get name of creator of poll, names of voters (not object ids)
       const poll = await Poll.findById(pollId)
             .populate("createdBy","name")
             .populate("options.votes","name");
    // Check if poll exists
      if (!poll) {
            return res.status(400).json({
                success: false,
                message: "Poll not found"
            })
        }
        // Find trip for authorization by pollId
        const trip = await Trip.findById(poll.tripId);

         // Check if user is member
        if (!isTripMember(trip, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Only trip members can view this poll"
            });
        }

        // Send response
        return res.status(200).json({
            success: true,
            poll
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

export const votePoll = async(req,res) =>  {
    try 
    {
      // Get pollId, optionId (tripId can be accessed from pollId)
      const {pollId,optionId} = req.body;
      // Validate fields
       if (!pollId) {
            return res.status(400).json({
                success: false,
                message: "Please enter poll ID"
            })
        }
        if (!Types.ObjectId.isValid(pollId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid poll ID"
            })
        }
         if (!optionId) {
            return res.status(400).json({
                success: false,
                message: "Please enter option ID"
            })
        }
        if (!Types.ObjectId.isValid(optionId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid option ID"
            })
        }

        // Find poll
        const poll = await Poll.findById(pollId);
        // Check if poll exists
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found"
            })
        }
        // Find trip
        const trip = await Trip.findById(poll.tripId);
        
        // Check if logged in user is member of the trip
        if(!isTripMember(trip,req.user._id)) {
             return res.status(403).json({
                success: false,
                message: "Only trip members can vote in the polls"
            })
        }

        // Find selected option
        const selectedOption = poll.options.id(optionId);
        // Check if selected option exists in the poll
         if (!selectedOption) {
            return res.status(404).json({
                success: false,
                message: "Option not found"
            })
        }

        // For multiple choice poll
        if(poll.allowMultipleVotes) {
            // Check if member is trying to vote the voted option again
            // Then we have to remove vote 
            // Vote stores user object id
            const alreadyVoted = selectedOption.votes.some (
                vote => vote.toString() === req.user._id.toString()
            );
          if(alreadyVoted){

   selectedOption.votes.pull(
      req.user._id
   );

   await poll.save();

   return res.status(200).json({
      success:true,
      message:"Vote removed successfully"
   });
}
        // If not then push user object id into votes array
        selectedOption.votes.push(req.user._id);
        }
        // For single choice poll
        else {
            // Remove old vote for all options when trying to select new option/ voting for first time
            poll.options.forEach(option => {
                option.votes.pull(req.user._id);
            });
            // Now add new vote, push user object id in votes array
            selectedOption.votes.push(req.user._id);
        }

        console.log(
  selectedOption.votes
);
        // Save in database
        await poll.save();
       // Send response
        return res.status(200).json({
            success: true,
            message: "Vote recorded successfully"
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

export const deletePoll =  async(req,res) =>  {
    try {
     // Get poll id from url
     const {pollId} = req.params;
     // Validate pollId
     if (!pollId) {
            return res.status(400).json({
                success: false,
                message: "Please enter poll ID"
            })
        }
        if (!Types.ObjectId.isValid(pollId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid poll ID"
            })
        }
     // Find poll
     const poll = await Poll.findById(pollId);
     // Check if poll exists
     if(!poll) {
         return res.status(404).json({
                success: false,
                message: "Poll not found"
            })
     }
     // Find trip
     const trip = await Trip.findById(poll.tripId);
     // Check if logged in user is admin
     const isAdmin = isTripAdmin(trip,req.user._id);
     // Check if logged in user in creator
     const isPollCreator = poll.createdBy.toString() === req.user._id.toString();
     // If not admin or creator - cannot delete
     if(!isAdmin && !isPollCreator) {
        return res.status(403).json({
                success: false,
                message: "Only admins and creator of polls can delete the polls"
            })
     }
     // Delete Poll
     await Poll.findByIdAndDelete(pollId);
     // Send response
     return res.status(200).json({
                success: false,
                message: "Poll deleted successfully"
            })
    }
     catch (error) {
        console.log(error)
        return res.status(500).json({
            success: true,
            message: "Server side error"
        })
    }
}