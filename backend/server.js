const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({ extended: false }));

// check if env file is provided
const isValidEnv = () => {
  if (process.env.PORT && process.env.JWT_SECRET && process.env.MONGO_URI) {
    return true;
  } else {
    return false;
  }
};

// Middleware
app.use(bodyParser.json());

// check if env file is provided. if yes it will connect database
if (isValidEnv()) {
  connectDB();
}

// Models
require("./models/userModel");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/post"));

// check if env file is provided. if yes it will start server
if (isValidEnv()) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
} else {
  console.log("error please add .env file to run this program💻💻💻");
  console.log("can't connect mongodb without mongo uri");
  console.log(
    JSON.stringify(
      {
        PORT: "PORT number",
        JWT_SECRET: "your jwt secret",
        MONGO_URI: "your mongodb uri",
      },
      null,
      2
    )
  );
}
