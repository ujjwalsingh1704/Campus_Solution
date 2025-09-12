import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, default: 1 }
      }
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
