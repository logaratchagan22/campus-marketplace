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

//     // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
//     // This safely checks a hidden environment variable instead of revealing your email!
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
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

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and print it inside server console logs
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     // Generate a 6-digit random number
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP to user document (valid for 10 minutes)
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // SECURITY & TESTING PRINT: Read this directly in your Render Logs dashboard panel!
//     console.log("=========================================");
//     console.log(`🔒 SECURITY SYSTEM OTP FOR: ${user.email}`);
//     console.log(`YOUR ONE-TIME PASSWORD IS: ${otp}`);
//     console.log("=========================================");

//     res.json({ message: "OTP generated successfully. Please check the backend server logs to retrieve it!" });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/verify-otp
// // @desc    Verify if the OTP supplied by the user is valid and active
// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } // Must not be expired
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }

//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/reset-password
// // @desc    Reset password using valid OTP and matching confirm strings
// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     // Verify token one last time to prevent route manipulation injection
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }

//     // Assign new password (automatically hashes via pre-save middleware hooks)
//     user.password = newPassword;
    
//     // Clear out OTP values so they cannot be reused
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();

//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
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

//     // --- AUTOMATIC DEV ADMIN UPGRADE PATCH ---
//     // This safely checks a hidden environment variable instead of revealing your email!
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
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

// // // @route   POST /api/auth/forgot-password
// // // @desc    Generate a random 6-digit OTP and send it directly to the user's real email address via Brevo API
// // router.post("/forgot-password", async (req, res, next) => {
// //   try {
// //     const { email } = req.body;
// //     if (!email) {
// //       return res.status(400).json({ message: "Email is required" });
// //     }

// //     const user = await User.findOne({ email: email.toLowerCase() });
// //     if (!user) {
// //       return res.status(404).json({ message: "No account found with that email" });
// //     }

// //     // Generate a 6-digit random number
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //     // Save OTP to user document (valid for 10 minutes)
// //     user.resetOtp = otp;
// //     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
// //     await user.save();

// //     // --- LIVE EMAIL SENDING VIA BREVO HTTPS API ---
// //     const brevoKey = process.env.BREVO_API_KEY;
    
// //     if (brevoKey) {
// //       await fetch("https://brevo.com", {
// //         method: "POST",
// //         headers: {
// //           "accept": "application/json",
// //           "api-key": brevoKey,
// //           "content-type": "application/json"
// //         },
// //         body: JSON.stringify({
// //           sender: { 
// //             name: "Campus Marketplace Security", 
// //             email: "security@campusmarketplace.local"
// //           },
// //           to: [{ 
// //             email: user.email, 
// //             name: user.name 
// //           }],
// //           subject: "Your Account Password Reset OTP Verification Code",
// //           htmlContent: `
// //             <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
// //               <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
// //               <p>Hi ${user.name},</p>
// //               <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
// //               <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
// //                 ${otp}
// //               </div>
// //               <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only. If you did not make this request, you can safely ignore this email.</p>
// //             </div>
// //           `
// //         })
// //       });
      
// //       console.log(`✉️ Live OTP Email dispatched successfully via Brevo to: ${user.email}`);
// //     } else {
// //       // Fallback log backup if your environment variable hasn't loaded yet
// //       console.log("⚠️ BREVO_API_KEY variable is missing on Render. Falling back to terminal log:");
// //       console.log("=========================================");
// //       console.log(`🔒 SECURITY SYSTEM OTP FOR: ${user.email}`);
// //       console.log(`YOUR ONE-TIME PASSWORD IS: ${otp}`);
// //       console.log("=========================================");
// //     }
// //     // ----------------------------------------------------

// //     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
// //   } catch (err) {
// //     next(err);
// //   }
// // });
// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it directly to the user's real email address via Brevo API
// const axios = require("axios"); // Make sure to keep this require at the top or inside the route!

// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     // Generate a secure 6-digit random number
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP configuration to user document (valid for 10 minutes)
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // --- LIVE EMAIL SENDING VIA BREVO API ---
//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only. If you did not make this request, you can safely ignore this email.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
      
//       console.log(`✉️ Live OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     } else {
//       console.log("⚠️ BREVO_API_KEY variable is missing on Render.");
//     }
//     // ----------------------------------------------------

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });


// // @route   POST /api/auth/verify-otp
// // @desc    Verify if the OTP supplied by the user is valid and active
// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } // Must not be expired
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }

//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/reset-password
// // @desc    Reset password using valid OTP and matching confirm strings
// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     // Verify token one last time to prevent route manipulation injection
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }

//     // Assign new password (automatically hashes via pre-save middleware hooks)
//     user.password = newPassword;
    
//     // Clear out OTP values so they cannot be reused
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();

//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;


// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { protect } = require("../middleware/auth");
// const axios = require("axios"); // MOVED SAFELY TO THE ABSOLUTE TOP OF THE FILE

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// // @desc    Create a new account
// router.post("/register", async (req, res, next) => {
//   try {
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

//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
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

// // @route   GET /api/auth/users
// // @desc    Get all users (Admin only)
// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it directly to the user's real email address via Brevo API
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only. If you did not make this request, you can safely ignore this email.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
      
//       console.log(`✉️ Live OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     } else {
//       console.log("⚠️ BREVO_API_KEY variable is missing on Render.");
//     }

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/verify-otp
// // @desc    Verify if the OTP supplied by the user is valid and active
// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }

//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/reset-password
// // @desc    Reset password using valid OTP and matching confirm strings
// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }

//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();

//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { protect } = require("../middleware/auth");
// const nodemailer = require("nodemailer"); // INTEGRATED STABLE TRANSPORT ENGINE

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// router.post("/register", async (req, res, next) => {
//   try {
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
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it via Nodemailer SMTP Relay
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // Nodemailer Configuration Setup
//     const transporter = nodemailer.createTransport({
//       host: "smtp-relay.brevo.com",
//       port: 587,
//       secure: false, // TLS configuration setup
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: '"Campus Marketplace Security" <security@campusmarketplace.local>',
//       to: user.email,
//       subject: "Your Account Password Reset OTP Verification Code",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//           <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//           <p>Hi ${user.name},</p>
//           <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//           <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✉️ Live SMTP OTP Email sent successfully to: ${user.email}`);

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }
//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }
//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }
//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();
//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { protect } = require("../middleware/auth");
// const axios = require("axios"); // Robust HTTP Client

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// router.post("/register", async (req, res, next) => {
//   try {
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
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it via HTTP API (Port 443) to avoid firewall blocks
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       // Outbound secure API request on standard Port 443 (HTTPS)
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
      
//       console.log(`✉️ Live HTTP API OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     } else {
//       console.log("⚠️ BREVO_API_KEY variable is missing on Render configuration tabs.");
//     }

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }
//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }
//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }
//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();
//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { protect } = require("../middleware/auth");
// const axios = require("axios"); // Robust HTTP Client

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// router.post("/register", async (req, res, next) => {
//   try {
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
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it via HTTP API (Port 443) to avoid firewall blocks
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       // FIX: Changed API endpoint target URL to Brevo's live transactional mail route
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
      
//       console.log(`✉️ Live HTTP API OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     } else {
//       console.log("⚠️ BREVO_API_KEY variable is missing on Render configuration tabs.");
//     }

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }
//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }
//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }
//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();
//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const authMiddleware = require("../middleware/auth"); // Changed to direct object mapping
// const axios = require("axios");

// const router = express.Router();

// // Fallback logic to check if protect is packed inside an object or exported directly
// const protect = authMiddleware.protect || authMiddleware;

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// router.post("/register", async (req, res, next) => {
//   try {
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
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
//       console.log(`✉️ Live HTTP API OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     }

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }
//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }
//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }
//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();
//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

//module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const authMiddleware = require("../middleware/auth");
// const axios = require("axios");

// const router = express.Router();

// const protect = authMiddleware.protect || authMiddleware;

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
//     role: user.role, 
//     createdAt: user.createdAt,
//   };
// }

// // @route   POST /api/auth/register
// router.post("/register", async (req, res, next) => {
//   try {
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
//     if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//       user.role = "admin";
//       await user.save();
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: sanitizeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   GET /api/auth/me
// router.get("/me", protect, async (req, res) => {
//   res.json({ user: sanitizeUser(req.user) });
// });

// // @route   GET /api/auth/users
// router.get("/users", protect, async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({}).select("name email role createdAt");
//     res.json({ users });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Generate a random 6-digit OTP and send it via HTTP API (Port 443) to avoid firewall blocks
// router.post("/forgot-password", async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with that email" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOtp = otp;
//     user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const brevoKey = process.env.BREVO_API_KEY;
    
//     if (brevoKey) {
//       await axios.post("https://brevo.com", {
//         sender: { 
//           name: "Campus Marketplace Security", 
//           email: "security@campusmarketplace.local"
//         },
//         to: [{ 
//           email: user.email, 
//           name: user.name 
//         }],
//         subject: "Your Account Password Reset OTP Verification Code",
//         htmlContent: `
//           <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
//             <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
//             <p>Hi ${user.name},</p>
//             <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
//             <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
//               ${otp}
//             </div>
//             <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
//           </div>
//         `
//       }, {
//         headers: {
//           "accept": "application/json",
//           "api-key": brevoKey,
//           "content-type": "application/json"
//         }
//       });
//       console.log(`✉️ Live HTTP API OTP Email dispatched successfully via Brevo to: ${user.email}`);
//     } else {
//       console.log("⚠️ BREVO_API_KEY variable is missing on Render configuration tabs.");
//     }

//     res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/verify-otp
// router.post("/verify-otp", async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP code are required" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() } 
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired OTP code" });
//     }
//     res.json({ message: "OTP code successfully verified. You can now reset your password." });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /api/auth/reset-password
// router.post("/reset-password", async (req, res, next) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are strictly required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New password and confirmation password do not match" });
//     }
//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       resetOtp: otp,
//       resetOtpExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Session expired or verification token invalid" });
//     }
//     user.password = newPassword;
//     user.resetOtp = null;
//     user.resetOtpExpires = null;
//     await user.save();
//     res.json({ message: "Your password has been changed successfully. You can now log in!" });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router; // ENSURED THIS IS AT THE VERY BOTTOM

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const axios = require("axios");

const router = express.Router();

const protect = authMiddleware.protect || authMiddleware;

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
    role: user.role, 
    createdAt: user.createdAt,
  };
}

// @route   POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
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
    if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      user.role = "admin";
      await user.save();
    }
    const token = signToken(user._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

// @route   GET /api/auth/users
router.get("/users", protect, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const users = await User.find({}).select("name email role createdAt");
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/forgot-password
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const brevoKey = process.env.BREVO_API_KEY;
    
    if (brevoKey) {
      // ✅ FIXED: Changed target endpoint URL to Brevo's live transactional email route
      await axios.post("https://brevo.com", {
        sender: { 
          name: "Campus Marketplace Security", 
          email: "security@campusmarketplace.local"
        },
        to: [{ 
          email: user.email, 
          name: user.name 
        }],
        subject: "Your Account Password Reset OTP Verification Code",
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e4e4e7; border-radius: 8px;">
            <h2 style="color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 10px;">Account Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for your Campus Marketplace account. Use the verification code below to proceed:</p>
            <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d; border: 1px solid #e4e4e7; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #666; line-height: 1.5;">This security token code is active and valid for the next 10 minutes only.</p>
          </div>
        `
      }, {
        headers: {
          "accept": "application/json",
          "api-key": brevoKey,
          "content-type": "application/json"
        }
      });
      console.log(`✉️ Live HTTP API OTP Email dispatched successfully via Brevo to: ${user.email}`);
    } else {
      console.log("⚠️ BREVO_API_KEY variable is missing on Render configuration tabs.");
    }

    res.json({ message: "A secure verification OTP code has been sent directly to your registered email account inbox." });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() } 
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
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Session expired or verification token invalid" });
    }
    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();
    res.json({ message: "Your password has been changed successfully. You can now log in!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
