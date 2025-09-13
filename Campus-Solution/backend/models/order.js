import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        category: { type: String },
        image: { type: String },
        customizations: { type: String }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentMethod: { type: String, enum: ["wallet", "cash", "card"], default: "wallet" },
    orderNumber: { type: String, unique: true },
    estimatedTime: { type: Number }, // in minutes
    specialInstructions: { type: String },
    deliveryLocation: { type: String }
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD' + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model("Order", orderSchema);
