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
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
