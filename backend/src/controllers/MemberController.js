import { Types } from "mongoose";

import Trip from "../models/TripModel.js";
import Itinerary from "../models/ItineraryModel.js";
import Expense from "../models/ExpenseModel.js";
import Poll from "../models/PollModel.js";
import Gallery from "../models/GalleryModel.js";

export const getMemberStats =
async (req, res) => {

  try {

    const {
      tripId,
      memberId
    } = req.params;

    const trip =
      await Trip.findById(
        tripId
      );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    const itinerariesAdded =
      await Itinerary.countDocuments({
        tripId,
        createdBy: memberId
      });

    const expensesFiled =
      await Expense.countDocuments({
        tripId,
        createdBy: memberId
      });

    const photosContributed =
      await Gallery.countDocuments({
        tripId,
        uploadedBy: memberId
      });

    const polls =
      await Poll.find({
        tripId
      });

    let pollVotesCast = 0;

    polls.forEach(
      poll => {

        poll.options.forEach(
          option => {

            option.votes.forEach(
              vote => {

                if (
                  vote.toString() ===
                  memberId
                ) {
                  pollVotesCast++;
                }

              }
            );

          }
        );

      }
    );

    return res.status(200).json({
      success: true,

      stats: {
        itinerariesAdded,
        expensesFiled,
        pollVotesCast,
        photosContributed
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server side error"
    });

  }

};