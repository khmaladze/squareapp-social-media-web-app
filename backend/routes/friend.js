const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Storie = require("../models/storieModel");
const Friend = require("../models/friendModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");
const mongoose = require("mongoose");
// validation post request schema
// const postRequestSchema = Joi.object({
//   text: Joi.string().max(300).trim(),
//   image: Joi.string().trim(),
//   video: Joi.string().trim(),
// });

//////////////////////////////
// /* Get Friend Request */ //
//////////////////////////////
router.get(
  "/get",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const friend = await Friend.find({
        reciver: req.user._id,
        active: true,
        ignore: false,
      }).populate("reciver sender", "profileImage userName");

      res.status(200).json({
        success: true,
        message: "friend request get successfully",
        friendAdd: friend,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

///////////////////////////////////
// /* Response Friend Request */ //
///////////////////////////////////
router.post(
  "/response",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { response, requestId } = req.body;

      const friend = await Friend.find({
        _id: requestId,
        reciver: req.user._id,
      }).populate("reciver", "profileImage userName");

      if (response) {
        const me = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { friends: friend[0].sender } },
          {
            new: true,
          }
        );
        const user = await User.findByIdAndUpdate(
          friend[0].sender,
          { $push: { friends: req.user._id } },
          {
            new: true,
          }
        );
        await Friend.findByIdAndUpdate(
          requestId,
          { active: false },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: "friend response add successfully",
          accept: true,
        });
      } else {
        await Friend.findByIdAndUpdate(
          requestId,
          { ignore: true, active: false },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: "friend response add successfully",
          accept: false,
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

///////////////////////////////////
// /*     Remove Friend       */ //
///////////////////////////////////
router.post(
  "/removeuser",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { userId } = req.body;
      const thisUser = await User.findById(userId);

      const me = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { friends: thisUser._id } },
        {
          new: true,
        }
      );

      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: req.user._id } },
        {
          new: true,
        }
      );
      if (me && user) {
        const deleteRequest = await Friend.find({
          sender: req.user._id,
          reciver: thisUser._id,
        });
        const deleteRequestSecond = await Friend.find({
          sender: thisUser._id,
          reciver: req.user._id,
        });
        if (deleteRequest.length > 0) {
          await Friend.deleteOne({
            sender: req.user._id,
            reciver: thisUser._id,
          });
          return res.status(200).json({
            success: true,
            message: "friend remove successfully",
          });
        }
        if (deleteRequestSecond.length > 0) {
          await Friend.find({
            sender: thisUser._id,
            reciver: req.user._id,
          });

          return res.status(200).json({
            success: true,
            message: "friend remove successfully",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "can't remove friend successfully",
        });
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

//////////////////////////////
// /*     Get User       */ //
//////////////////////////////
router.get(
  "/user/:username",
  protect,
  asyncHandler(async (req, res) => {
    try {
      if (req.user.userName == req.params.username) {
        return res.status(200).json({
          success: true,
          message: "it's your username",
        });
      }

      const user = await User.find({ userName: req.params.username }).select(
        "_id profileImage backgroundImage userName firstName lastName place hobby"
      );

      if (user.length == 0) {
        return res.status(200).json({
          success: true,
          message: "user not found",
        });
      }

      const isFriend = await User.find({
        _id: req.user._id,
        friends: {
          $in: [mongoose.Types.ObjectId(user[0]._id)],
        },
      });
      if (isFriend.length > 0) {
        return res.status(200).json({
          success: true,
          message: "user is your friend",
        });
      }
      const alreadySend = await Friend.find({
        sender: req.user._id,
        reciver: user[0]._id,
        active: true,
        ignore: false,
      });

      const alreadyRecive = await Friend.find({
        sender: user[0]._id,
        reciver: req.user._id,
        active: true,
        ignore: false,
      });

      const alreadyResponse = await Friend.find({
        sender: req.user._id,
        reciver: user[0]._id,
        active: false,
        ignore: true,
      });

      if (user.length > 0) {
        if (alreadyResponse.length > 0) {
          return res.status(200).json({ success: true, message: "no data" });
        }
        if (
          alreadySend.length > 0 &&
          alreadyRecive.length == 0 &&
          isFriend.length == 0
        ) {
          return res.status(200).json({
            success: true,
            message: "get user successfully",
            user,
            alreadySend: true,
            alreadyRecive: false,
            alreadyFriend: false,
          });
        }

        if (
          alreadySend.length == 0 &&
          alreadyRecive.length == 0 &&
          isFriend.length > 0
        ) {
          return res.status(200).json({
            success: true,
            message: "get user successfully",
            user,
            alreadySend: false,
            alreadyRecive: false,
            alreadyFriend: true,
          });
        }
        if (
          alreadySend.length == 0 &&
          alreadyRecive.length == 0 &&
          isFriend.length == 0
        ) {
          return res.status(200).json({
            success: true,
            message: "get user successfully",
            user,
            alreadySend: false,
            alreadyRecive: false,
            alreadyFriend: false,
          });
        }

        if (alreadyRecive.length > 0) {
          return res.status(200).json({
            success: true,
            message: "user already send you request",
            // user,
            alreadySend: false,
            alreadyRecive: true,
            alreadyFriend: false,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "no data",
            // user,
            alreadySend: false,
            alreadyRecive: false,
            alreadyFriend: false,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
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

//////////////////////////////
// /* Add Friend Request */ //
//////////////////////////////
router.post(
  "/add",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const { reciver } = req.body;

      const check = await User.find({
        _id: reciver,
      });

      if (!check) {
        return res
          .status(400)
          .json({ success: false, message: "user not found" });
      }

      const checkIfUserAlreadySend = await Friend.find({
        sender: reciver,
        reciver: req.user._id,
      });
      if (checkIfUserAlreadySend.length > 0) {
        return res.status(400).json({
          success: false,
          message: "user already send request to you",
        });
      }
      const friendsData = await User.find({
        _id: { $in: req.user.friends.filter((id) => id == reciver) },
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
        return res.status(400).json({
          success: false,
          message: "user is your friend",
        });
      }
      if (friendsData.length == 0) {
        const alreadySend = await Friend.find({
          sender: req.user._id,
          reciver: reciver,
          active: true,
          ignore: false,
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
      const friend = await Friend.find({
        sender: req.user._id,
        ignore: false,
      }).populate("reciver sender", "profileImage userName");
      if (!friend.length > 0) {
        res.status(400).json({
          success: false,
          message: "user can't remove",
        });
      }
      const { reciver } = req.body;
      const friendsData = await User.find({
        _id: { $in: req.user.friends.filter((id) => id == reciver) },
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

        // if (alreadySend.length == 0) {
        //   const friendAdd = await Friend.create({
        //     sender: req.user,
        //     reciver: reciver,
        //   });

        //   res.status(200).json({
        //     success: true,
        //     message: "friend request send successfully",
        //     friendAdd,
        //   });
        // }
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
