const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      trim: true,
    },
    sender: {
      type: String,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
