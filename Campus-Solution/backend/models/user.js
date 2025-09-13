import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "faculty", "admin", "canteen_staff"],
      default: "student"
    },
    department: { type: String },
    studentId: { type: String },
    employeeId: { type: String },
    phone: { type: String },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    // Gamification fields
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    level: { type: Number, default: 1 },
    // Wallet fields
    walletBalance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
