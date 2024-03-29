const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

// validation message request schema
const messageRequestSchema = Joi.object({
  text: Joi.string().min(1).max(300).trim().required(),
});

/////////////////////////////////
//     /* Send Message */      //
/////////////////////////////////
router.post(
  "/send/message/:userId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { text } = req.body;

      const validate = await messageRequestSchema.validateAsync(req.body);

      const addMessage = await Message.create({
        reciver: req.params.userId,
        sender: req.user.id,
        text,
        conversationId: String(req.user._id + req.params.userId),
      });

      res.status(200).json({
        success: true,
        message: "message send successfully",
        addMessage,
      });
    } catch (error) {
      console.log(error);
      if (error.details) {
        if (error.details[0].message) {
          res
            .status(400)
            .json({ success: false, message: error.details[0].message });
        }
      } else {
        res.status(500).json({
          success: false,
          message: "try later",
        });
      }
    }
  })
);

/////////////////////////////////
//   /* Get user Message */    //
/////////////////////////////////
router.get(
  "/get/message/:userId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const users = [req.user._id, req.params.userId];
      const conversationId = [
        String(req.user._id + req.params.userId),
        String(req.params.userId + req.user._id),
      ];
      const message = await Message.find({
        sender: users.map((i) => i),
        reciver: users.map((i) => i),
        conversationId: conversationId.map((i) => i),
      }).populate("reciver sender", "_id userName profileImage");
      console.log();
      res
        .status(200)
        .json({ success: true, message: "messages get successfully", message });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

module.exports = router;
