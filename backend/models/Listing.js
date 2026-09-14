const mongoose = require("mongoose");

const CATEGORIES = ["books", "electronics", "cycles", "furniture", "other"];

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "worn"],
      default: "good",
    },
    photos: [
      {
        url: String, // relative path served statically, e.g. /uploads/filename.jpg
        filename: String,
      },
    ],
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Support text search on title/description
listingSchema.index({ title: "text", description: "text" });
// Support common filter/sort combinations
listingSchema.index({ category: 1, status: 1, createdAt: -1 });

listingSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model("Listing", listingSchema);
