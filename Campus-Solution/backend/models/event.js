import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // e.g., "2025-09-20"
    time: { type: String },
    location: { type: String },
    roomNumber: { type: String }, // e.g., "AUD-001", "LAB-301"
    category: { type: String, enum: ['academic', 'sports', 'cultural', 'technical', 'social', 'workshop', 'seminar', 'other'], default: 'other' },
    capacity: { type: Number },
    tags: [String],
    
    // Event details for faculty-created events
    rules: { type: String }, // Event rules and regulations
    penalties: { type: String }, // Penalties for rule violations
    dressCode: { type: String }, // Dress code requirements
    requirements: { type: String }, // Prerequisites or materials needed
    
    registrations: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      registeredAt: { type: Date, default: Date.now }
    }],
    
    // Approval workflow
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'upcoming', 'ongoing', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
