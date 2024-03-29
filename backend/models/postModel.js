const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    video: {
      type: String,
      trim: true,
    },
    privacy: {
      type: String,
      enum: ["onlyMe", "friends", "public"],
      default: "onlyMe",
    },
    comment: [
      {
        comment: String,
        commentBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        date: { type: Date, default: Date.now },
      },
    ],
    like: [
      {
        like: {
          type: String,
          enum: ["like", "love"],
          default: "like",
        },
        likeBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        date: { type: Date, default: Date.now },
      },
    ],
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlockedDate: {
      type: Date,
      default: Date.now,
    },
    expireToken: Date,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
