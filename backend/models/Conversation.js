const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// One conversation per buyer per listing - clicking "I'm interested" again just reopens it
conversationSchema.index({ listing: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
