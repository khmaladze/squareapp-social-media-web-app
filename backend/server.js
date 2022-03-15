const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
