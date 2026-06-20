import Settlement from "../models/SettlementModel.js";
import { getTrip, isTripMember } from "../utils/TripHelpers.js";
import { Types } from "mongoose";
import Notification
from "../models/NotificationModel.js";
import Trip
from "../models/TripModel.js";

export const getSettlements =
async (req, res) => {

  try {

    const { tripId } =
      req.params;

    if (
      !Types.ObjectId.isValid(
        tripId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid trip ID"
      });
    }

    const trip =
      await getTrip(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message:
          "Trip not found"
      });
    }

    if (
      !isTripMember(
        trip,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized"
      });
    }

    const settlements =
      await Settlement.find({
        tripId
      })
      .populate(
        "from",
        "name profilePicture"
      )
      .populate(
        "to",
        "name profilePicture"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      settlements
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

export const markSettlementPaid =
async (req, res) => {

  try {

  


    const {
      settlementId
    } = req.params;

   const settlement =
  await Settlement.findById(
    settlementId
  )
  .populate(
    "from",
    "name"
  );

    if (!settlement) {

      return res.status(404).json({
        success: false,
        message:
          "Settlement not found"
      });

    }

   if (

  settlement.from._id.toString()
  !==
  req.user._id.toString()

) {

      return res.status(403).json({
        success: false,
        message:
          "Only debtor can mark paid"
      });

    }

   settlement.status =
  "AwaitingConfirmation";

await settlement.save();

  const trip =
      await getTrip(settlement.tripId);

await Notification.create({

  receiver:
    settlement.to,

 sender:
  settlement.from._id,

  tripId:
    settlement.tripId,

  type:
    "settlement",

 message:
  `${settlement.from.name} marked ₹${settlement.amount} as paid in ${trip.title}. Please confirm receipt.`,

  status:
    "pending",

  settlementId:
    settlement._id

});

    return res.status(200).json({
      success: true,
      message:
        "Payment marked as paid"
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

export const confirmSettlement =
async (req, res) => {

  try {

    const {
      settlementId
    } = req.params;

    const settlement =
      await Settlement.findById(
        settlementId
      );

    if (!settlement) {

      return res.status(404).json({
        success: false,
        message:
          "Settlement not found"
      });

    }

    if (

      settlement.to.toString()
      !==
      req.user._id.toString()

    ) {

      return res.status(403).json({
        success: false,
        message:
          "Only receiver can confirm"
      });

    }

    settlement.status =
      "Settled";

    await settlement.save();

    return res.status(200).json({
      success: true,
      message:
        "Settlement confirmed"
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