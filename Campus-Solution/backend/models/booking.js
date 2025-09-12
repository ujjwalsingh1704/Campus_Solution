import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resource: { type: String, required: true }, // classroom, lab, sports room
    date: { type: String, required: true }, // e.g., "2025-09-15"
    time: { type: String, required: true }, // e.g., "2:00 PM - 3:00 PM"
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending"
    },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
