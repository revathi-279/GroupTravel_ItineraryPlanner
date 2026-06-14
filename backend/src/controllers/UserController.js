import User from "../models/UserModel.js";
import Notification from "../models/NotificationModel.js";

export const searchUsers =
async (req, res) => {

    try {

        const { q } =
            req.query;

        if (
            !q ||
            !q.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Search query is required"
            });
        }

        const users =
  await User.find({
    _id: {
      $ne: req.user._id
    },
    $or: [
      {
        name: {
          $regex: q,
          $options: "i"
        }
      },
      {
        email: {
          $regex: q,
          $options: "i"
        }
      }
    ]
  })
  .select(
    "name email profilePicture"
  )
  .limit(10);

const usersWithInviteStatus =
  await Promise.all(

    users.map(
      async (user) => {

        const pendingInvite =
          await Notification.findOne({

            receiver:
              user._id,

            tripId:
              req.query.tripId,

            type:
              "trip_invitation",

            status:
              "pending"

          });

        return {

          ...user.toObject(),

          invitationPending:
            !!pendingInvite

        };
      }
    )
  );
  
return res.status(200).json({
  success: true,
  count:
    usersWithInviteStatus.length,
  users:
    usersWithInviteStatus
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