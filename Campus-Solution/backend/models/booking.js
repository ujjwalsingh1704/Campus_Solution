import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
    resourceName: { type: String, required: true },
    resourceType: { type: String, required: true },
    date: { type: String, required: true }, // e.g., "2025-09-15"
    startTime: { type: String, required: true }, // e.g., "14:00"
    endTime: { type: String, required: true }, // e.g., "15:00"
    purpose: { type: String, required: true },
    attendees: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending"
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contactInfo: { type: String },
    specialRequirements: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
