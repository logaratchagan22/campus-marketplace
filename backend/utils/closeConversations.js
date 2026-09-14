const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Called whenever a listing becomes 'sold' (or is deleted). Permanently removes
// every conversation and message tied to that listing, so no buyer/seller can
// see or continue that chat afterwards. This is intentional for privacy/security:
// once an item is sold, there's no reason for the two parties to stay in contact
// through the platform.
async function closeConversationsForListing(listingId) {
  const conversations = await Conversation.find({ listing: listingId }, "_id");
  const ids = conversations.map((c) => c._id);

  if (ids.length === 0) return { conversationsRemoved: 0, messagesRemoved: 0 };

  const messageResult = await Message.deleteMany({ conversation: { $in: ids } });
  const conversationResult = await Conversation.deleteMany({ _id: { $in: ids } });

  return {
    conversationsRemoved: conversationResult.deletedCount,
    messagesRemoved: messageResult.deletedCount,
  };
}

module.exports = { closeConversationsForListing };
