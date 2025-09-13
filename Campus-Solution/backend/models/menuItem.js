import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'],
      required: true 
    },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ['mild', 'medium', 'spicy'], default: 'mild' },
    preparationTime: { type: Number, default: 15 }, // in minutes
    ingredients: [String],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },
    tags: [String],
    popularity: { type: Number, default: 0 },
    isEcoFriendly: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
