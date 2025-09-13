import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true }, // Can be ObjectId or subject code
    subject: { type: String, required: true }, // Subject name for quick access
    courseCode: { type: String, required: true },
    instructor: { type: String, required: true },
    day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String, required: true }, // e.g., "10:00"
    endTime: { type: String, required: true }, // e.g., "11:00"
    room: { type: String, required: true },
    classType: { type: String, enum: ['lecture', 'lab', 'tutorial', 'seminar'], default: 'lecture' },
    students: [{ type: String }], // Array of student names/IDs enrolled
    enrolledCount: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    weeklyHours: { type: Number, default: 0 },
    semester: { type: String },
    academicYear: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
