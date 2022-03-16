const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");

// check if email is valid
function isValidEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email.toLowerCase()
  );
}

// check if email clients are gmail or yahoo
function isValidGmailProvider(email) {
  return /.+@(gmail)\.com$/.test(email.toLowerCase());
}

// validation register request schema
const registerRequestSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-z]+$/)
    .lowercase()
    .min(2)
    .max(50)
    .trim()
    .required(),
  lastName: Joi.string()
    .pattern(/^[a-z]+$/)
    .lowercase()
    .min(2)
    .max(50)
    .trim()
    .required(),
  userName: Joi.string().min(2).max(30).trim().required(),
  birthDate: Joi.string().isoDate().required(),
  email: Joi.string().email().required(),
  password: Joi.string().lowercase().min(2).max(30).trim().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

// validation login request schema
const loginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().lowercase().min(2).max(30).trim().required(),
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

///////////////////////////
// /* Register User  */  //
///////////////////////////
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    try {
      // get data from body
      let {
        firstName,
        lastName,
        userName,
        birthDate,
        email,
        password,
        confirmPassword,
      } = req.body;

      if (
        firstName &&
        lastName &&
        userName &&
        birthDate &&
        email &&
        password &&
        confirmPassword
      ) {
        // validate request body
        const schemaValidation = await registerRequestSchema.validateAsync(
          req.body
        );

        // validate email provider
        if (!isValidEmail(email)) {
          res
            .status(400)
            .json({ success: false, message: "only valid email is allowed" });
        } else if (!isValidGmailProvider(email)) {
          res
            .status(400)
            .json({ success: false, message: "only @gmail.com is allowed" });
        } else {
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            birthDate: birthDate,
            email: email,
            password: hashedPassword,
          });

          res.status(200).json({
            success: true,
            message: "user register successfully.",
            user,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "please add all the fields.",
        });
      }
    } catch (error) {
      if (error.details) {
        if (error.details[0].message) {
          res
            .status(400)
            .json({ success: false, message: error.details[0].message });
        }
      } else if (error.code == 11000 && error.keyPattern.email) {
        res.status(400).json({
          success: false,
          message: "can't register with this email. please try another email.",
        });
      } else if (error.code == 11000 && error.keyPattern.userName) {
        res.status(400).json({
          success: false,
          message:
            "can't register with this userName. please try another userName.",
        });
      } else if (error.details) {
        if (error.details[0].path[0] == "birthDate") {
          res.status(400).json({
            success: false,
            message:
              "can't register with this date. please use this format year-month-day.",
          });
        }
      }
    }
  })
);

///////////////////////////
//  /*  Login User  */   //
///////////////////////////
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      // get data from body
      let { email, password } = req.body;

      // check if all fields isn't empty
      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "please add all the field" });
      }

      // validate request body
      const schemaValidation = await loginRequestSchema.validateAsync(req.body);

      // validate email provider
      if (!isValidEmail(email)) {
        res
          .status(400)
          .json({ success: false, message: "only valid email is allowed" });
      } else if (!isValidGmailProvider(email)) {
        res
          .status(400)
          .json({ success: false, message: "only @gmail.com is allowed" });
      }

      // Check for user email
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          user,
          token: generateToken(user._id),
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "error, please try later" });
      }
    } catch (error) {
      if (error.details) {
        if (error.details[0].message) {
          res
            .status(400)
            .json({ success: false, message: error.details[0].message });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "error, please try later" });
      }
    }
  })
);

module.exports = router;
