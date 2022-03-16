const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    images: {
      type: Array,
    },
    video: {
      type: String,
    },
    privacy: {
      type: String,
      enum: ["onlyMe", "friends", "public"],
      default: "onlyMe",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
