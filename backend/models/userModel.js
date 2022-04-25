const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    biography: {
      type: String,
      required: true,
      default: "add to",
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
      trim: true,
    },
    friends: {
      type: Array,
      default: [],
    },
    place: {
      type: String,
      default: "",
      trim: true,
    },
    hobby: {
      type: String,
      enum: [
        "Sailing",
        "DownhillSkiing",
        "IceSkating",
        "Kayaking",
        "Kitesurfing",
        "NordicWalking",
        "Paragliding",
        "Pool",
        "Skateboarding",
        "Sledding",
        "Snowboarding",
        "SportsEsports",
        "SportsMartialArts",
        "Surfing",
        "Fitbit",
        "FitnessCenter",
        "GolfCourse",
        "Sport",
        "SportsBaseball",
        "SportsBasketball",
        "SportsHandball",
        "",
      ],
      default: "",
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    backgroundImage: {
      type: String,
      default: "",
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
      trim: true,
    },
    // agree: {
    //   type: Boolean,
    //   enum: ["true"],
    //   required: true,
    //   default: true,
    // },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
