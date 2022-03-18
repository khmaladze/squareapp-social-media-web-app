const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversationModel");
const Messsage = require("../models/messageModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

/////////////////////////////////
// / * Create Conversation */  //
/////////////////////////////////
router.post(
  "/add/conversation",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { first, receiver } = req.body;

      if (first && receiver) {
        // check if conversation already created
        const findConversation = await Conversation.findOne({
          members: [first, receiver],
        });

        if (!findConversation) {
          const conversation = await Conversation.create({
            members: [first, receiver],
          });

          res.status(200).json({
            success: true,
            message: "conversation created",
            conversation,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "can't create conversation",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "please add all the fields",
        });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
