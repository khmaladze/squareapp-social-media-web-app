const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(bodyParser.json());

connectDB();

// Models
require("./models/userModel");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
