import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['classroom', 'lab', 'auditorium', 'sports', 'library', 'meeting_room', 'other'],
      required: true 
    },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String },
    amenities: [String], // projector, whiteboard, computers, etc.
    isAvailable: { type: Boolean, default: true },
    bookingRules: {
      maxHours: { type: Number, default: 4 },
      advanceBookingDays: { type: Number, default: 7 },
      requiresApproval: { type: Boolean, default: true }
    },
    operatingHours: {
      start: { type: String, default: "08:00" },
      end: { type: String, default: "18:00" }
    },
    image: { type: String },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
