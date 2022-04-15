const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
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
      }).select("_id profileImage backgorundImage userName firstName lastName");
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
  "/user/profile/:profileId",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.profileId,
        isBlocked: false,
      }).select("_id profileImage backgorundImage userName firstName lastName");
      const post = await User.find({
        postedBy: user._id,
      });
      res.status(200).json({
        success: true,
        message: "get profile  successfully",
        user,
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "try later",
      });
    }
  })
);

module.exports = router;
