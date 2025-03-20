import errorHandler from "../middleware/error.js";
import user from "../model/user.model.js";
import bcrypt from "bcrypt";
import Event from "../model/event.model.js";

export const userUpdate = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(res, 401, "Unauthorized"));
  }

  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(res, 403, "You are not allowed to update this user")
    );
  }

  try {
    // Check if user exists
    const existingUser = await user.findById(req.user.id);
    if (!existingUser) {
      return next(errorHandler(res, 404, "User not found"));
    }

    // Create update object with only fields that are being updated
    const updateDetail = {};

    // Handle fullName update
    if (req.body.fullName) {
      if (req.body.fullName.includes(" ")) {
        return next(errorHandler(res, 400, "Full name cannot contain spaces"));
      }
      updateDetail.fullName = req.body.fullName;
    }

    // Handle email update
    if (req.body.email) {
      updateDetail.email = req.body.email;
    }

    // Handle password update only if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(res, 400, "Password must be at least 6 characters long")
        );
      }
      updateDetail.password = await bcrypt.hash(req.body.password, 10);
    }

    // Handle image update
    if (req.body.image) {
      updateDetail.image = req.body.image;
    }
    const updateUser = await user.findByIdAndUpdate(req.user.id, updateDetail, {
      new: true,
    });

    const mongoObject = updateUser.toObject();
    delete mongoObject.password;

    res.status(200).json(mongoObject);
  } catch (error) {
    next(error);
  }
};
// Dashboard Controller
// export const getDashboardData = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the logged-in user's ID from the request
//     const userName = req.user.email; // Get user's name

//     // Fetch events the user has hosted
//     const hostedEvents = await Event.find({ hostedBy: userName });

//     // Fetch events the user has attended
//     const attendedEvents = await Event.find({ "attendances.id": userId });

//     // Fetch past events the user attended (history)
//     const historyEvents = await Event.find({
//       "attendances.id": userId,
//       // status: "Completed",
//     });

//     res.status(200).json({
//       success: true,
//       hostedEvents,
//       attendedEvents,
//       historyEvents,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

