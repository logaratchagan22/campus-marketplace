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
//     role: user.role, // Added role field here
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// // @desc    Create a new account
// router.post("/register", async (req, res, next) => {
//   try {
//     // Campus variable removed from body parsing parameters
//     const { name, email, password } = req.body;

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

//     // Auto-Admin logic: If this is the absolute first user account created, make them an admin!
//     const isFirstAccount = (await User.countDocuments({})) === 0;
//     const role = isFirstAccount ? "admin" : "user";

//     const user = await User.create({ name, email, password, role });
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

//     // // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
//     // // Change "your-email@example.com" to your actual marketplace logging email address!
//     // if (user.email === "your-email@example.com") {
//     //   user.role = "admin";
//     //   await user.save();
//     // }
//         // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
//     // This safely checks a hidden environment variable instead of revealing your email!
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     // ------------------------------------------

//     // ------------------------------------------

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
// // @route   GET /api/auth/users
// // @desc    Get all users (Admin only)
// router.get("/users", protect, async (req, res, next) => {
//   try {
//     // Check if the current user is an admin
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     // Fetch all users but DO NOT include passwords
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });
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

    // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
    // This safely checks a hidden environment variable instead of revealing your email!
    if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      user.role = "admin";
      await user.save();
    }
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

// @route   POST /api/auth/forgot-password
// @desc    Generate a random 6-digit OTP and print it inside server console logs
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    // Generate a 6-digit random number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to user document (valid for 10 minutes)
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // SECURITY & TESTING PRINT: Read this directly in your Render Logs dashboard panel!
    console.log("=========================================");
    console.log(`🔒 SECURITY SYSTEM OTP FOR: ${user.email}`);
    console.log(`YOUR ONE-TIME PASSWORD IS: ${otp}`);
    console.log("=========================================");

    res.json({ message: "OTP generated successfully. Please check the backend server logs to retrieve it!" });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify if the OTP supplied by the user is valid and active
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() } // Must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    res.json({ message: "OTP code successfully verified. You can now reset your password." });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using valid OTP and matching confirm strings
router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are strictly required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation password do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Verify token one last time to prevent route manipulation injection
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Session expired or verification token invalid" });
    }

    // Assign new password (automatically hashes via pre-save middleware hooks)
    user.password = newPassword;
    
    // Clear out OTP values so they cannot be reused
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: "Your password has been changed successfully. You can now log in!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


