// const express = require("express");
// const Listing = require("../models/Listing");
// const { protect } = require("../middleware/auth");
// const upload = require("../middleware/upload");
// const { closeConversationsForListing } = require("../utils/closeConversations");

// const router = express.Router();

// function toPhotoObjects(files = []) {
//   return files.map((file) => ({
//     url: `/uploads/${file.filename}`,
//     filename: file.filename,
//   }));
// }

// // @route   GET /api/listings
// // @desc    Browse/search listings with category filter + pagination
// // Query params:
// //   q         - free text search across title/description
// //   category  - one of Listing.CATEGORIES
// //   status    - 'available' | 'sold' (defaults to 'available' for public browsing)
// //   minPrice, maxPrice - numeric range filters
// //   sort      - 'newest' (default) | 'price_asc' | 'price_desc'
// //   page      - default 1
// //   limit     - default 12, max 50
// router.get("/", async (req, res, next) => {
//   try {
//     const {
//       q,
//       category,
//       status,
//       minPrice,
//       maxPrice,
//       sort = "newest",
//       page = 1,
//       limit = 12,
//     } = req.query;

//     const filter = {};

//     if (status && ["available", "sold"].includes(status)) {
//       filter.status = status;
//     } else {
//       filter.status = "available";
//     }

//     if (category && Listing.CATEGORIES.includes(category)) {
//       filter.category = category;
//     }

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     if (q && q.trim()) {
//       filter.$text = { $search: q.trim() };
//     }

//     const sortMap = {
//       newest: { createdAt: -1 },
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//     };
//     const sortOption = sortMap[sort] || sortMap.newest;

//     const pageNum = Math.max(1, parseInt(page, 10) || 1);
//     const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
//     const skip = (pageNum - 1) * limitNum;

//     const [listings, total] = await Promise.all([
//       Listing.find(filter)
//         .sort(sortOption)
//         .skip(skip)
//         .limit(limitNum)
//         .populate("seller", "name campus"),
//       Listing.countDocuments(filter),
//     ]);

//     res.json({
//       listings,
//       pagination: {
//         total,
//         page: pageNum,
//         limit: limitNum,
//         totalPages: Math.ceil(total / limitNum) || 1,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   GET /api/listings/categories
// // @desc    Return the fixed list of categories (for building filter UI)
// router.get("/categories", (req, res) => {
//   res.json({ categories: Listing.CATEGORIES });
// });

// // @route   GET /api/listings/mine
// // @desc    Listings created by the logged-in user (any status)
// router.get("/mine", protect, async (req, res, next) => {
//   try {
//     const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
//     res.json({ listings });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   GET /api/listings/:id
// // @desc    Get a single listing
// router.get("/:id", async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id).populate("seller", "name campus");
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     res.json({ listing });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/listings
// // @desc    Create a listing with up to 5 photos
// router.post("/", protect, upload.array("photos", 5), async (req, res, next) => {
//   try {
//     const { title, description, price, quantity, category, condition } = req.body;

//     if (!title || !description || price === undefined || !category) {
//       return res
//         .status(400)
//         .json({ message: "title, description, price and category are required" });
//     }

//     const initialQuantity = quantity === undefined || quantity === "" ? 1 : Number(quantity);
//     if (!Number.isFinite(initialQuantity) || initialQuantity < 1) {
//       return res.status(400).json({ message: "quantity must be at least 1" });
//     }

//     const listing = await Listing.create({
//       title,
//       description,
//       price,
//       quantity: initialQuantity,
//       category,
//       condition,
//       photos: toPhotoObjects(req.files),
//       seller: req.user._id,
//     });

//     res.status(201).json({ listing });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   PUT /api/listings/:id
// // @desc    Update a listing's details (owner only). New photos are appended.
// router.put("/:id", protect, upload.array("photos", 5), async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     if (String(listing.seller) !== String(req.user._id)) {
//       return res.status(403).json({ message: "You can only edit your own listings" });
//     }

//     const { title, description, price, quantity, category, condition, status } = req.body;

//     if (title !== undefined) listing.title = title;
//     if (description !== undefined) listing.description = description;
//     if (price !== undefined) listing.price = price;
//     if (category !== undefined) listing.category = category;
//     if (condition !== undefined) listing.condition = condition;
//     if (status !== undefined) listing.status = status;

//     if (quantity !== undefined && quantity !== "") {
//       listing.quantity = quantity;
//       // Auto-mark sold when stock runs out, unless the seller explicitly set a status above
//       if (Number(quantity) <= 0 && status === undefined) {
//         listing.status = "sold";
//       } else if (Number(quantity) > 0 && status === undefined && listing.status === "sold") {
//         listing.status = "available";
//       }
//     }

//     if (req.files && req.files.length > 0) {
//       listing.photos.push(...toPhotoObjects(req.files));
//     }

//     await listing.save();

//     // If this update resulted in the listing being sold, permanently close all chats about it
//     if (listing.status === "sold") {
//       await closeConversationsForListing(listing._id);
//     }

//     res.json({ listing });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   PATCH /api/listings/:id/status
// // @desc    Quickly toggle a listing between 'available' and 'sold' (owner only)
// router.patch("/:id/status", protect, async (req, res, next) => {
//   try {
//     const { status } = req.body;
//     if (!["available", "sold"].includes(status)) {
//       return res.status(400).json({ message: "status must be 'available' or 'sold'" });
//     }

//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     if (String(listing.seller) !== String(req.user._id)) {
//       return res.status(403).json({ message: "You can only update your own listings" });
//     }

//     listing.status = status;
//     await listing.save();

//     // Marking a listing sold permanently closes any buyer-seller chats about it
//     if (status === "sold") {
//       await closeConversationsForListing(listing._id);
//     }

//     res.json({ listing });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   DELETE /api/listings/:id
// // @desc    Delete a listing (owner only)
// router.delete("/:id", protect, async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     if (String(listing.seller) !== String(req.user._id)) {
//       return res.status(403).json({ message: "You can only delete your own listings" });
//     }

//     await listing.deleteOne();
//     await closeConversationsForListing(listing._id);
//     res.json({ message: "Listing deleted" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;
const express = require("express");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { closeConversationsForListing } = require("../utils/closeConversations");

const router = express.Router();

function toPhotoObjects(files = []) {
  return files.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
  }));
}

// @route   GET /api/listings
// @desc    Browse/search listings with category filter + pagination
router.get("/", async (req, res, next) => {
  try {
    const {
      q,
      category,
      status,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (status && ["available", "sold"].includes(status)) {
      filter.status = status;
    } else {
      filter.status = "available";
    }

    if (category && Listing.CATEGORIES.includes(category)) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate("seller", "name"), // Campus field reference clean up
      Listing.countDocuments(filter),
    ]);

    res.json({
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/listings/categories
// @desc    Return the fixed list of categories
router.get("/categories", (req, res) => {
  res.json({ categories: Listing.CATEGORIES });
});

// @route   GET /api/listings/mine
// @desc    Listings created by the logged-in user (any status)
router.get("/mine", protect, async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing
router.get("/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "name"); // Campus field reference clean up
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/listings
// @desc    Create a listing with up to 5 photos
router.post("/", protect, upload.array("photos", 5), async (req, res, next) => {
  try {
    const { title, description, price, quantity, category, condition } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res
        .status(400)
        .json({ message: "title, description, price and category are required" });
    }

    const initialQuantity = quantity === undefined || quantity === "" ? 1 : Number(quantity);
    if (!Number.isFinite(initialQuantity) || initialQuantity < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      quantity: initialQuantity,
      category,
      condition,
      photos: toPhotoObjects(req.files),
      seller: req.user._id,
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/listings/:id
// @desc    Update a listing's details (owner or admin).
router.put("/:id", protect, upload.array("photos", 5), async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // UPDATED PERMISSION GATE: Allow access if current user is owner OR an admin
    const isOwner = String(listing.seller) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only edit your own listings unless you are an admin" });
    }

    const { title, description, price, quantity, category, condition, status } = req.body;

    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (price !== undefined) listing.price = price;
    if (category !== undefined) listing.category = category;
    if (condition !== undefined) listing.condition = condition;
    if (status !== undefined) listing.status = status;

    if (quantity !== undefined && quantity !== "") {
      listing.quantity = quantity;
      if (Number(quantity) <= 0 && status === undefined) {
        listing.status = "sold";
      } else if (Number(quantity) > 0 && status === undefined && listing.status === "sold") {
        listing.status = "available";
      }
    }

    if (req.files && req.files.length > 0) {
      listing.photos.push(...toPhotoObjects(req.files));
    }

    await listing.save();

    if (listing.status === "sold") {
      await closeConversationsForListing(listing._id);
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/listings/:id/status
// @desc    Quickly toggle a listing between 'available' and 'sold' (owner or admin)
router.patch("/:id/status", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["available", "sold"].includes(status)) {
      return res.status(400).json({ message: "status must be 'available' or 'sold'" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // UPDATED PERMISSION GATE: Allow access if current user is owner OR an admin
    const isOwner = String(listing.seller) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only update your own listings unless you are an admin" });
    }

    listing.status = status;
    await listing.save();

    if (status === "sold") {
      await closeConversationsForListing(listing._id);
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing (owner or admin)
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // UPDATED PERMISSION GATE: Allow access if current user is owner OR an admin
    const isOwner = String(listing.seller) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own listings unless you are an admin" });
    }

    await listing.deleteOne();
    await closeConversationsForListing(listing._id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
