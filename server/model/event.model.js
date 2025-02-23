import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    hostedBy: {
      type: String,
      required: true,
    },
    attendances: [
      {
        id: {
          type: String,
        },
        fullName: {
          type: String,
        },
      },
    ],
    month: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    image: {
      type: String,
      default: "",
    },
    location:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
