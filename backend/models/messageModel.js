const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    conversationId: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
