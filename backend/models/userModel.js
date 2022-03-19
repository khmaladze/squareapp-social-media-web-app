const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    biography: {
      type: String,
      required: true,
      default: "add to",
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    birthDate: {
      type: Date,
      required: true,
    },
    agree: {
      type: Boolean,
      enum: ["true"],
      required: true,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
