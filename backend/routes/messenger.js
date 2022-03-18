const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

// validation conversation request schema
const conversationRequestSchema = Joi.object({
  first: Joi.string().trim().required(),
  receiver: Joi.string().trim().required(),
});

// validation message request schema
const messageRequestSchema = Joi.object({
  text: Joi.string().min(1).max(300).trim().required(),
});

/////////////////////////////////
//  /* Create Conversation */  //
/////////////////////////////////
router.post(
  "/add/conversation",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { first, receiver } = req.body;

      const validate = await conversationRequestSchema.validateAsync(req.body);

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
// /* Get User Conversation */ //
/////////////////////////////////
router.get(
  "/get/my/conversation",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // check if conversation already created
      const findConversation = await Conversation.find({
        members: { $in: [req.user.id] },
      });

      if (findConversation) {
        res.status(200).json({
          success: true,
          message: "conversation get successfully",
          findConversation,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "can't create conversation",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

/////////////////////////////////
// /* Get One Conversation */  //
/////////////////////////////////
router.get(
  "/get/conversation/:userId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // check if conversation already created
      const findConversation = await Conversation.find({
        members: { $all: [req.user.id, req.params.userId] },
      });

      if (findConversation) {
        res.status(200).json({
          success: true,
          message: "conversation get successfully",
          findConversation,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "can't create conversation",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

/////////////////////////////////
//     /* Send Message */      //
/////////////////////////////////
router.post(
  "/send/message/:conversationId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { text } = req.body;

      const validate = await messageRequestSchema.validateAsync(req.body);

      const addMessage = await Message.create({
        conversationId: req.params.conversationId,
        sender: req.params.id,
        text,
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
//     /* Send Message */      //
/////////////////////////////////
router.get(
  "/get/message/:conversationId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const message = await Message.find({
        conversationId: req.params.conversationId,
      });
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
