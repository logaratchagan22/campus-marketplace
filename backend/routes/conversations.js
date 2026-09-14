const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

const router = express.Router();

function isParticipant(conversation, userId) {
  const buyerId = conversation.buyer?._id ?? conversation.buyer;
  const sellerId = conversation.seller?._id ?? conversation.seller;
  return String(buyerId) === String(userId) || String(sellerId) === String(userId);
}

// @route   POST /api/conversations
// @desc    Buyer clicks "I'm interested" - opens (or reopens) a private thread with the seller
router.post("/", protect, async (req, res, next) => {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.status !== "available") {
      return res
        .status(400)
        .json({ message: "This listing is no longer available for messaging" });
    }
    if (String(listing.seller) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't message yourself about your own listing" });
    }

    // Reuse an existing thread for this buyer + listing instead of creating duplicates
    let conversation = await Conversation.findOne({ listing: listingId, buyer: req.user._id });
    if (!conversation) {
      conversation = await Conversation.create({
        listing: listingId,
        buyer: req.user._id,
        seller: listing.seller,
      });
    }

    res.status(201).json({ conversation });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/conversations
// @desc    Inbox - every thread the logged-in user is part of, as either buyer or seller
router.get("/", protect, async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .sort({ updatedAt: -1 })
      .populate("listing", "title price status photos")
      .populate("buyer", "name")
      .populate("seller", "name");

    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/conversations/:id/messages
// @desc    Full message history for one thread (participants only)
router.get("/:id/messages", protect, async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("listing", "title price status photos")
      .populate("buyer", "name")
      .populate("seller", "name");

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "This conversation is no longer available" });
    }
    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "You are not part of this conversation" });
    }

    const messages = await Message.find({ conversation: conversation._id }).sort({
      createdAt: 1,
    });

    res.json({ conversation, messages });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/conversations/:id/messages
// @desc    Send a message in a thread (participants only)
router.post("/:id/messages", protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res
        .status(404)
        .json({ message: "This conversation is no longer available" });
    }
    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "You are not part of this conversation" });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    // Touch the conversation so it sorts to the top of the inbox
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
