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

      const username = req.body.userName;
      if (username !== req.user.userName) {
        const findIfExists = await User.find({
          userName: username,
        });
        if (findIfExists.length > 0) {
          return res
            .status(400)
            .json({ success: false, message: "user can't use this username" });
        }
      }
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

      const isFriend = await User.find({
        _id: {
          $in: req.user.friends.filter((id) => id == req.params.profileId),
        },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );

      const alreadySend = await Friend.find({
        sender: req.user._id,
        reciver: user[0]._id,
        active: true,
        ignore: false,
      });

      const alreadyReciver = await Friend.find({
        sender: user[0]._id,
        reciver: req.user._id,
        active: true,
        ignore: false,
      });

      if (isFriend.length > 0) {
        const postPrivacy = ["public", "friends"];
        const storie = await Storie.find({
          postedBy: req.params.profileId,
          privacy: { $in: postPrivacy.map((i) => i) },
          isBlocked: false,
          expireToken: { $gt: Date.now() },
        }).sort("-createdAt");
        const post = await Post.find({
          postedBy: req.params.profileId,
          privacy: postPrivacy.map((i) => i),
          isBlocked: false,
        })
          .sort("-createdAt")
          .populate(
            "postedBy comment.commentBy",
            "firstName lastName profileImage backgroundImage"
          );

        res.status(200).json({
          success: true,
          message: "get profile  successfully",
          user,
          post,
          storie,
          friend: true,
        });
      } else {
        const storie = await Storie.find({
          postedBy: req.params.profileId,
          privacy: "public",
          isBlocked: false,
          expireToken: { $gt: Date.now() },
        }).sort("-createdAt");
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

        if (alreadySend.length == 0 && alreadyReciver.length == 0) {
          res.status(200).json({
            success: true,
            message: "get profile  successfully",
            user,
            post,
            storie,
            friend: false,
            alreadySend: false,
            alreadyReciver: false,
          });
        }
        if (alreadySend.length > 0) {
          res.status(200).json({
            success: true,
            message: "get profile  successfully",
            user,
            post,
            storie,
            friend: false,
            alreadySend: true,
            alreadyReciver: false,
            requestId: alreadySend[0]._id,
          });
        }
        if (alreadyReciver.length > 0) {
          res.status(200).json({
            success: true,
            message: "get profile  successfully",
            user,
            post,
            storie,
            friend: false,
            alreadySend: false,
            alreadyReciver: true,
            requestId: alreadyReciver[0]._id,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

module.exports = router;
