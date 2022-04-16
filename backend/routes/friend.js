const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Storie = require("../models/storieModel");
const Friend = require("../models/friendModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

// validation post request schema
// const postRequestSchema = Joi.object({
//   text: Joi.string().max(300).trim(),
//   image: Joi.string().trim(),
//   video: Joi.string().trim(),
// });

//////////////////////////////
// /* Add Friend Request */ //
//////////////////////////////
router.post(
  "/add/:userId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { reciver } = req.params.userId;

      const friendsData = await User.find({
        _id: { $in: req.user.friends.map((id) => req.params.userId) },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      if (friendsData) {
        res.status(400).json({
          success: false,
          message: "user is your friend",
        });
      }
      if (!friendsData) {
        const friendAdd = await Friend.create({
          sender: req.user,
          reciver: reciver,
        });

        res.status(200).json({
          success: true,
          message: "friend request send successfully",
          friendAdd,
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

module.exports = router;
