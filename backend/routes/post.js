const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

// validation post request schema
const postRequestSchema = Joi.object({
  text: Joi.string().max(300).trim(),
});

///////////////////////////
//   /*  Add Post  */    //
///////////////////////////
router.post(
  "/add",
  protect,
  asyncHandler(async (req, res) => {
    try {
      let { text, image, video, privacy } = req.body;
      let postCreate = {
        postedBy: req.user,
      };
      if (text) {
        postCreate.text = text;
      }
      if (image) {
        postCreate.image = image;
      }
      if (video) {
        postCreate.video = video;
      }
      if (privacy) {
        postCreate.privacy = privacy;
      }
      if (!text && !image && !video) {
        res.status(400).json({
          success: false,
          message:
            "if you want to add post you need to add minimum  text or image or video",
        });
      } else {
        const post = await Post.create(postCreate);
        res
          .status(200)
          .json({ success: true, message: "post created successfully.", post });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
