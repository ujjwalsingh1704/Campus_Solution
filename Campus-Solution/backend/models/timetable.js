import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    course: { type: String, required: true },
    faculty: { type: String, required: true },
    time: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
    day: { type: String, required: true }, // e.g., "Monday"
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
