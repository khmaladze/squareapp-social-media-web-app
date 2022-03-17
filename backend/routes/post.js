const express = require("express");
const router = express.Router();
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
      const validatePostRequestSchema = await postRequestSchema.validateAsync(
        req.body
      );

      let { text, image, video, privacy } = req.body;
      let postCreate = {
        postedBy: req.user,
        text,
        image,
        video,
      };

      if (!text && !image && !video) {
        res.status(400).json({
          success: false,
          message:
            "if you want to add post you need to add minimum  text or image or video",
        });
      } else {
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
        const post = await Post.create(postCreate);
        res
          .status(200)
          .json({ success: true, message: "post created successfully", post });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

///////////////////////////
// /*  Update Post  */   //
///////////////////////////
router.put(
  "/update/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);

      // Check for user
      if (!req.user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (post) {
        if (post.postedBy.toString() !== req.user.id) {
          res.status(400).json({
            success: false,
            message: "User not authorized",
          });
        }
        let { text, image, video, privacy } = req.body;
        const validatePostRequestSchema = await postRequestSchema.validateAsync(
          req.body
        );
        let postUpdate = {
          postedBy: req.user,
        };
        if (text) {
          postUpdate.text = text;
        }
        if (image) {
          postUpdate.image = image;
        }
        if (video) {
          postUpdate.video = video;
        }
        if (privacy) {
          postUpdate.privacy = privacy;
        }
        if (!text && !image && !video && !privacy) {
          res.status(400).json({
            success: false,
            message:
              "if you want to update post you need to add minimum  text or image or video",
          });
        } else {
          const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            postUpdate,
            {
              new: true,
            }
          );

          res.status(200).json({
            success: true,
            message: `post id=${req.params.id} updated successfully`,
            updatePost,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "post not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "please try again",
      });
    }
  })
);

///////////////////////////
// /*  Delete Post  */   //
///////////////////////////
router.delete(
  "/delete/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Check for user
      if (!req.user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (post) {
        if (post.postedBy.toString() !== req.user.id) {
          return res.status(400).json({
            success: false,
            message: "User not authorized",
          });
        } else {
          await post.remove();
          res.status(200).json({
            success: true,
            message: `post id=${req.params.id} deleted`,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "post not found",
        });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

///////////////////////////
// /* Post Comment  */   //
///////////////////////////
router.put(
  "/comment",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // Check for user
      if (!req.user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      // comment
      const addComment = {
        comment: req.body.comment,
        commentBy: req.user._id,
      };

      // post id
      const postId = req.body.postId;

      // if post exist add comment
      if (postId) {
        let post = await Post.findById(postId);
        if (post) {
          const addedComment = await Post.findByIdAndUpdate(
            postId,
            {
              $push: { comment: addComment },
            },
            { new: true }
          );
          res.status(200).json({
            success: true,
            message: "comment added successfully",
            addedComment,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "post not found",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "please try later",
      });
    }
  })
);

module.exports = router;
