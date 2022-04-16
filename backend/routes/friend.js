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
// /*     Get User       */ //
//////////////////////////////
router.get(
  "/user/:username",
  protect,
  asyncHandler(async (req, res) => {
    try {
      if (req.user.userName == req.params.username) {
        res.status(200).json({
          success: true,
          message: "it's your username",
        });
      }
      const friendsData = await User.find({
        userName: {
          $in: req.user.friends.map((userName) => req.params.username),
        },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      if (friendsData.length > 0) {
        res.status(200).json({
          success: true,
          message: "user is your friend",
        });
        console.log(friendsData);
      }
      if (friendsData.length == 0) {
        const user = await User.find({ userName: req.params.username }).select(
          "_id profileImage backgroundImage userName firstName lastName place hobby"
        );
        const alreadySend = await Friend.find({
          sender: req.user._id,
          reciver: user[0]._id,
        });
        if (user.length > 0) {
          if (alreadySend.length > 0) {
            res.status(200).json({
              success: true,
              message: "get user successfully",
              user,
              alreadySend: true,
            });
          } else {
            res.status(200).json({
              success: true,
              message: "get user successfully",
              user,
              alreadySend: false,
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "user not found",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

//////////////////////////////
// /* Add Friend Request */ //
//////////////////////////////
router.post(
  "/add",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { reciver } = req.body;
      console.log(reciver);
      const check = await User.find({
        _id: reciver,
      });
      console.log(check);
      if (!check) {
        return res
          .status(400)
          .json({ success: false, message: "user not found" });
      }

      console.log("reciver", reciver);
      const friendsData = await User.find({
        _id: { $in: req.user.friends.map((id) => reciver) },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      console.log(friendsData);
      //   if (friendsData.length > 0) {
      //     res.status(400).json({
      //       success: false,
      //       message: "can't add friend",
      //     });
      //   }
      if (friendsData.length > 0) {
        res.status(400).json({
          success: false,
          message: "user is your friend",
        });
      }
      if (friendsData.length == 0) {
        const alreadySend = await Friend.find({
          sender: req.user._id,
          reciver: reciver,
        });
        console.log(alreadySend);

        if (alreadySend.length > 0) {
          res.status(400).json({
            success: false,
            message: "friend request already send",
          });
        }

        if (alreadySend.length == 0) {
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
// /* Delete Friend Request */ //
/////////////////////////////////
router.post(
  "/remove",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { reciver } = req.body;
      console.log(reciver);
      console.log("reciver", reciver);
      const friendsData = await User.find({
        _id: { $in: req.user.friends.map((id) => reciver) },
        isBlocked: false,
      }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );
      console.log(friendsData);
      //   if (friendsData.length > 0) {
      //     res.status(400).json({
      //       success: false,
      //       message: "can't add friend",
      //     });
      //   }
      if (friendsData.length > 0) {
        res.status(400).json({
          success: false,
          message: "user is your friend",
        });
      }
      if (friendsData.length == 0) {
        const alreadySend = await Friend.find({
          sender: req.user._id,
          reciver: reciver,
        });
        console.log(alreadySend);

        if (alreadySend.length > 0) {
          await Friend.deleteOne({
            sender: req.user._id,
            reciver: reciver,
          });
          res.status(200).json({
            success: true,
            message: "friend request remove",
          });
        }

        if (alreadySend.length == 0) {
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
