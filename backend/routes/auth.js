// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { protect } = require("../middleware/auth");

// const router = express.Router();

// function signToken(userId) {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });
// }

// function sanitizeUser(user) {
//   return {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     campus: user.campus,
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// // @desc    Create a new account
// router.post("/register", async (req, res, next) => {
//   try {
//     const { name, email, password, campus } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email and password are required" });
//     }
//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const existing = await User.findOne({ email: email.toLowerCase() });
//     if (existing) {
//       return res.status(409).json({ message: "An account with that email already exists" });
//     }

//     const user = await User.create({ name, email, password, campus });
//     const token = signToken(user._id);

//     res.status(201).json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate and receive a JWT
// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   GET /api/auth/me
// // @desc    Return the currently authenticated user
// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// module.exports = router;
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // Added role field here
    createdAt: user.createdAt,
  };
}

// @route   POST /api/auth/register
// @desc    Create a new account
router.post("/register", async (req, res, next) => {
  try {
    // Campus variable removed from body parsing parameters
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    // Auto-Admin logic: If this is the absolute first user account created, make them an admin!
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate and receive a JWT
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
    // // Change "your-email@example.com" to your actual marketplace logging email address!
    // if (user.email === "your-email@example.com") {
    //   user.role = "admin";
    //   await user.save();
    // }
        // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
    // This safely checks a hidden environment variable instead of revealing your email!
    if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      user.role = "admin";
      await user.save();
    }
    // ------------------------------------------

    // ------------------------------------------

    const token = signToken(user._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Return the currently authenticated user
router.get("/me", protect, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = router;
// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
router.get("/users", protect, async (req, res, next) => {
  try {
    // Check if the current user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all users but DO NOT include passwords
    const users = await User.find({}).select("name email role createdAt");
    res.json({ users });
  } catch (err) {
    next(err);
  }
});


