const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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

// validation request schema
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

      // check if all fields isn't empty
      if (
        !firstName ||
        !lastName ||
        !userName ||
        !birthDate ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        res
          .status(400)
          .json({ success: false, message: "please add all the field" });
      }

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
      }

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
    } catch (error) {
      if (error.code == 11000 && error.keyPattern.email) {
        res.status(400).json({
          success: false,
          message: "can't register with this email. please try another email.",
        });
      } else if (error.details) {
        if (error.details[0].path[0] == "birthDate") {
          res.status(400).json({
            success: false,
            message:
              "can't register with this date. please use this format year/month/day.",
          });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "error, please try later" });
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
    } catch (error) {}
  })
);

module.exports = router;
