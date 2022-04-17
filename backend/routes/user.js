const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Storie = require("../models/storieModel");
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
// /*  Get User Friend   */ //
//////////////////////////////
router.get(
  "/friend",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const friendsData = await User.find({
        _id: { $in: req.user.friends.map((id) => id) },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      res.status(200).json({
        success: true,
        message: "get friends list successfully",
        friend: friendsData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

//////////////////////////////
// /* Update User Data   */ //
//////////////////////////////
router.put(
  "/update",
  protect,
  asyncHandler(async (req, res) => {
    try {
      let { token } = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      res
        .status(200)
        .json({ success: true, message: "user update success", user, token });
    } catch (error) {
      console.log(error);
    }
  })
);

//////////////////////////////
// /*  Get User Profile  */ //
//////////////////////////////
router.get(
  "/profile/:profileId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.profileId,
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby biography"
      );
      const post = await Post.find({
        postedBy: req.params.profileId,
        privacy: "public",
        isBlocked: false,
      })
        .sort("-createdAt")
        .populate(
          "postedBy comment.commentBy",
          "firstName lastName profileImage backgroundImage"
        );

      const storie = await Storie.find({
        postedBy: req.params.profileId,
        privacy: "public",
        isBlocked: false,
        expireToken: { $gt: Date.now() },
      });

      const friendsData = await User.find({
        _id: { $in: req.user.friends.map((id) => req.params.profileId) },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      console.log(friendsData);
      if (friendsData.length > 0) {
        res.status(200).json({
          success: true,
          message: "get profile  successfully",
          user,
          post,
          storie,
          friend: true,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "get profile  successfully",
          user,
          post,
          storie,
          friend: false,
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
