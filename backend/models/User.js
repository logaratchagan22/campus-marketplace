// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: 60,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false, // never return password by default
//     },
//     campus: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving, only if it was modified
// userSchema.pre("save", async function hashPassword(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", userSchema);
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: 60,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false, // never return password by default
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving, only if it was modified
// userSchema.pre("save", async function hashPassword(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", userSchema);
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: 60,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false, // never return password by default
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     // NEW FIELDS FOR OTP FORGOT PASSWORD FLOW
//     resetOtp: {
//       type: String,
//       default: null,
//     },
//     resetOtpExpires: {
//       type: Date,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving, only if it was modified
// userSchema.pre("save", async function hashPassword(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: 60,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

    // Signup email verification
    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // signupOtp: {
    //   type: String,
    //   default: null,
    //   select: false,
    // },
    // signupOtpExpires: {
    //   type: Date,
    //   default: null,
    //   select: false,
    // },
//     isEmailVerified: {
//   type: Boolean,
//   default: true, // Preserve existing accounts
// },
// signupOtp: {
//   type: String,
//   default: null,
//   select: false,
// },
// signupOtpExpires: {
//   type: Date,
//   default: null,
//   select: false,
// },

//     // Forgot Password verification (existing)
//     resetOtp: {
//       type: String,
//       default: null,
//       select: false,
//     },
//     resetOtpExpires: {
//       type: Date,
//       default: null,
//       select: false,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function hashPassword() {
//   if (!this.isModified("password")) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.comparePassword = function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Signup verification
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    signupOtp: {
      type: String,
      default: null,
      select: false,
    },
    signupOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // Forgot Password verification
    resetOtp: {
      type: String,
      default: null,
      select: false,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
