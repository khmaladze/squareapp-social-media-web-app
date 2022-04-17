const mongoose = require("mongoose");

const friendSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ignore: {
      type: Boolean,
      default: false,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friend", friendSchema);
