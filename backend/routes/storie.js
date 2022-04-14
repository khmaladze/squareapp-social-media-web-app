const express = require("express");
const router = express.Router();
const Storie = require("../models/storieModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const { protect } = require("../middleware/requireUserLogin");
const User = require("../models/userModel");

// validation storie request schema
const storieRequestSchema = Joi.object({
  text: Joi.string().max(300).trim(),
  image: Joi.string().trim(),
  video: Joi.string().trim(),
  privacy: Joi.string().valid("onlyMe", "friends", "public").trim(),
  archived: Joi.bool(),
});

///////////////////////////
//   /*  Add Storie  */  //
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
      const validatePostRequestSchema = await storieRequestSchema.validateAsync(
        req.body
      );

      let { text, image, video, privacy, archived } = req.body;

      let storieCreate = {
        postedBy: req.user,
        text,
        image,
        video,
        privacy,
        archived,
      };

      if (!text && !image && !video) {
        res.status(400).json({
          success: false,
          message:
            "if you want to add storie you need to add minimum text or image or video",
        });
      } else {
        if (text) {
          storieCreate.text = text;
        }

        if (image) {
          storieCreate.image = image;
        }

        if (video) {
          storieCreate.video = video;
        }

        if (privacy) {
          storieCreate.privacy = privacy;
        }
        if (archived) {
          storieCreate.archived = true;
        }
        oneDay = 1000 * 60 * 60 * 24 * 1;
        storieCreate.expireToken = Date.now() + oneDay;
        const storie = await Storie.create(storieCreate);

        storie
          ? res.status(200).json({
              success: true,
              message: "storie created successfully",
              storie,
            })
          : res.status(400).json({
              success: false,
              message: "storie can't create",
              storie,
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
        console.log(error);
        res.status(500).json({
          success: false,
          message: "try later",
        });
      }
    }
  })
);

////////////////////////////////
// /* Update Storie View   */ //
////////////////////////////////
router.put(
  "/update/add/view/:storieId",
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

      // storieId
      const storieId = req.params.storieId;

      if (storieId) {
        const storie = await Storie.findById(storieId);
        if (storie) {
          const AddView = {
            viewBy: req.user.id,
          };

          if (!storie.view.find((x) => x.viewBy == req.user.id)) {
            let addstorieview = await Storie.findByIdAndUpdate(
              storieId,
              {
                $push: { view: AddView },
              },
              { new: true }
            ).populate(
              "postedBy view.viewBy",
              "firstName lastName profileImage backgroundImage"
            );
            if (addstorieview) {
              res.status(200).json({
                success: true,
                message: "view add successfully",
                addstorieview,
              });
            }
          } else if (storie.view.find((x) => x.viewBy == req.user.id)) {
            res.status(200).json({
              success: true,
              message: "view is added already",
            });
            // res.status(400).json({
            //   success: false,
            //   message: "can't add storie view becouse already added",
            // });
          } else {
            res.status(400).json({
              success: false,
              message: "can't add storie view",
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
// /*  Delete Storie */  //
///////////////////////////
router.delete(
  "/delete/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const storie = await Storie.findById(req.params.id);

      // Check for user
      if (!req.user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (storie) {
        if (storie.postedBy.toString() === req.user.id) {
          await storie.remove();
          res.status(200).json({
            success: true,
            message: `storie id=${req.params.id} deleted`,
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
          message: "storie not found",
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
//  /* Storie Like  */   //
///////////////////////////
router.put(
  "/like/:storieId",
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

      // storieId
      const storieId = req.params.storieId;

      if (storieId) {
        const storie = await Storie.findById(storieId);
        const { like } = req.body;
        if (storie) {
          let Addlike = {
            likeBy: req.user.id,
            like,
          };

          if (like) {
            Addlike.like = like;
          }

          if (!storie.like.find((x) => x.likeBy == req.user.id)) {
            let likestorie = await Storie.findByIdAndUpdate(
              storieId,
              {
                $push: { like: Addlike },
              },
              { new: true }
            );
            if (likestorie) {
              res.status(200).json({
                success: true,
                message: "like add successfully",
                likestorie,
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "can't like storie",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "storie not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "can't like storie",
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
  "/delete/like/:storieId",
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

      // storieId
      const storieId = req.params.storieId;

      if (storieId) {
        const storie = await Storie.findById(storieId);
        if (storie) {
          if (storie.like.find((x) => x.likeBy == req.user.id)) {
            let unlikestorie = await Storie.findByIdAndUpdate(
              storieId,
              {
                $pull: { like: { likeBy: req.user.id } },
              },
              { new: true }
            );
            if (unlikestorie) {
              res.status(200).json({
                success: true,
                message: "like remove successfully",
                unlikestorie,
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "can't unlike storie",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "storie not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "can't unlike storie",
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
// /* Get My Storie  */  //
///////////////////////////
router.get(
  "/my",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const storie = await Storie.find({ postedBy: req.user._id })
        .sort("-createdAt")
        .populate(
          "postedBy view.viewBy",
          "firstName lastName profileImage backgroundImage"
        );
      res.status(200).json({ success: true, storie });
    } catch (error) {
      console.log(error);
    }
  })
);

///////////////////////////////
// /* Get Public Storie  */  //
///////////////////////////////
router.get(
  "/public",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const storie = await Storie.find({
        privacy: "public",
        isBlocked: false,
        expireToken: { $gt: Date.now() },
      })
        .sort("-createdAt")
        .select("-view")
        .populate("postedBy", "userName profileImage");
      res.status(200).json({ success: true, storie });
    } catch (error) {
      res.status(500).json({ success: false, message: "try later" });
    }
  })
);

///////////////////////////////
// /* Get Friend Storie  */  //
///////////////////////////////
router.get(
  "/friend",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const storie = await Storie.find({
        postedBy: { $in: req.user.friends.map((id) => id) },
        privacy: "friends",
        isBlocked: false,
        expireToken: { $gt: Date.now() },
      })
        .sort("-createdAt")
        .select("-view")
        .populate("postedBy", "userName profileImage");
      res.status(200).json({ success: true, storie });
    } catch (error) {
      res.status(500).json({ success: false, message: "try later" });
    }
  })
);

module.exports = router;
