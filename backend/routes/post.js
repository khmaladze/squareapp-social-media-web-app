const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");

// validation post request schema
const postRequestSchema = Joi.object({
  text: Joi.string().max(300).trim(),
  image: Joi.string().trim(),
  video: Joi.string().trim(),
  privacy: Joi.string().valid("onlyMe", "friends", "public").trim(),
});

// validation post request schema
const postCommentRequestSchema = Joi.object({
  postId: Joi.string(),
  comment: Joi.string().max(100).trim(),
});

///////////////////////////
//   /*  Add Post  */    //
///////////////////////////
router.post(
  "/add",
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

      // validate request body
      const validatePostRequestSchema = await postRequestSchema.validateAsync(
        req.body
      );

      let { text, image, video, privacy } = req.body;

      let postCreate = {
        postedBy: req.user,
        text,
        image,
        video,
        privacy,
      };

      if (!text && !image && !video) {
        res.status(400).json({
          success: false,
          message:
            "if you want to add post you need to add minimum text or image or video",
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
        fiveDay = 1000 * 60 * 60 * 24 * 5;
        postCreate.expireToken = Date.now() + fiveDay;

        const post = await Post.create(postCreate);

        post
          ? res.status(200).json({
              success: true,
              message: "post created successfully",
              post,
            })
          : res.status(400).json({
              success: false,
              message: "post can't create",
              post,
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

///////////////////////////
// /*  Update Post  */   //
///////////////////////////
router.put(
  "/update/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // check if post exist
      let post = await Post.findById(req.params.id);

      // Check for user
      if (!req.user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (post) {
        if (post.postedBy.toString() === req.user.id) {
          let { text, image, video, privacy } = req.body;

          // validate post request schema
          const validatePostRequestSchema =
            await postRequestSchema.validateAsync(req.body);

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
                "if you want to update post you need to add minimum  text or image or video or privacy",
            });
          } else {
            // update post
            const updatePost = await Post.findByIdAndUpdate(
              req.params.id,
              postUpdate,
              {
                new: true,
              }
            );

            updatePost
              ? res.status(200).json({
                  success: true,
                  message: `post id=${req.params.id} updated successfully`,
                  updatePost,
                })
              : res.status(400).json({
                  success: false,
                  message: `post id=${req.params.id} can't update`,
                });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "User not authorized",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "post not found",
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
        if (post.postedBy.toString() === req.user.id) {
          await post.remove();
          res.status(200).json({
            success: true,
            message: `post id=${req.params.id} deleted`,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "User not authorized",
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
        message: "try later",
      });
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

      // validate comment
      const validateCommentRequestSchema =
        await postCommentRequestSchema.validateAsync(req.body);

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

///////////////////////////
// /* Delete Comment */  //
///////////////////////////
router.put(
  "/delete/comment/:id",
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

      // post id
      const postId = req.body.postId;

      // if post exist add comment
      if (postId) {
        let post = await Post.findById(postId);
        if (post) {
          // check if this comment is commentby user
          if (
            post.comment.find((x) => x._id == req.params.id) &&
            post.comment.find(
              (x) => x.commentBy == req.user.id && x._id == req.params.id
            )
          ) {
            const updatedPost = await Post.findByIdAndUpdate(
              postId,
              {
                $pull: { comment: { _id: req.params.id } },
              },
              { new: true }
            );
            res.status(200).json({
              success: true,
              message: "comment remove successfully",
              updatedPost,
            });
          } else {
            res.status(400).json({
              success: false,
              message: "can't delete comment",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "post not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "post not found please provide postId",
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

///////////////////////////
//  /* Post Like  */     //
///////////////////////////
router.put(
  "/like/:postId",
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

      // postId
      const postId = req.params.postId;

      if (postId) {
        const post = await Post.findById(postId);
        const { like } = req.body;
        if (post) {
          let Addlike = {
            likeBy: req.user.id,
            like,
          };

          if (like) {
            Addlike.like = like;
          }

          if (!post.like.find((x) => x.likeBy == req.user.id)) {
            let likepost = await Post.findByIdAndUpdate(
              postId,
              {
                $push: { like: Addlike },
              },
              { new: true }
            );
            if (likepost) {
              res.status(200).json({
                success: true,
                message: "like add successfully",
                likepost,
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "can't like post",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "post not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "can't like post",
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

///////////////////////////
//  /* Delete Like  */   //
///////////////////////////
router.put(
  "/delete/like/:postId",
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

      // postId
      const postId = req.params.postId;

      if (postId) {
        const post = await Post.findById(postId);
        if (post) {
          if (post.like.find((x) => x.likeBy == req.user.id)) {
            let unlikepost = await Post.findByIdAndUpdate(
              postId,
              {
                $pull: { like: { likeBy: req.user.id } },
              },
              { new: true }
            );
            if (unlikepost) {
              res.status(200).json({
                success: true,
                message: "like remove successfully",
                unlikepost,
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "can't unlike post",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "post not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "can't unlike post",
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

///////////////////////////
//  /* Get My Post  */   //
///////////////////////////
router.get(
  "/my",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.find({ postedBy: req.user._id })
        .sort("-createdAt")
        .populate(
          "postedBy comment.commentBy",
          "firstName lastName profileImage backgroundImage"
        );
      res.status(200).json({ success: true, post });
    } catch (error) {
      console.log(error);
    }
  })
);

/////////////////////////////////
// /* Get All Public Post  */  //
/////////////////////////////////
router.get(
  "/public",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.find({
        privacy: "public",
        isBlocked: false,
        expireToken: { $gt: Date.now() },
      })
        .sort("-createdAt")
        .populate(
          "postedBy comment.commentBy",
          "firstName lastName profileImage backgroundImage"
        );
      res.status(200).json({ success: true, post });
    } catch (error) {
      console.log(error);
    }
  })
);

///////////////////////////////
// /* Get Friend Post    */  //
///////////////////////////////
router.get(
  "/friend",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const postPrivacy = ["friends", "public"];
      const post = await Post.find({
        postedBy: { $in: req.user.friends.map((id) => id) },
        privacy: { $in: postPrivacy.map((i) => i) },
        isBlocked: false,
        expireToken: { $gt: Date.now() },
      })
        .sort("-createdAt")
        .populate(
          "postedBy comment.commentBy",
          "firstName lastName profileImage backgroundImage"
        );
      res.status(200).json({ success: true, post });
    } catch (error) {
      res.status(500).json({ success: false, message: "try later" });
    }
  })
);

module.exports = router;
