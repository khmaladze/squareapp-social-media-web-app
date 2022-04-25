const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");

// check if env file is provided
const isValidEnv = () => {
  if (process.env.PORT && process.env.JWT_SECRET && process.env.MONGO_URI) {
    return true;
  } else {
    return false;
  }
};

// check if env file is provided. if yes it will connect database
if (isValidEnv()) {
  connectDB();
}

const app = express();
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(bodyParser.json());

// Models
require("./models/userModel");
require("./models/friendModel");
require("./models/messageModel");
require("./models/postModel");
require("./models/storieModel");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/post"));
app.use("/api/messenger", require("./routes/messenger"));
app.use("/api/user", require("./routes/user"));
app.use("/api/storie", require("./routes/storie"));
app.use("/api/friend", require("./routes/friend"));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
// app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
}

// check if env file is provided. if yes it will start server
if (isValidEnv()) {
  const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  if (server) {
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: { origin: "http://localhost:3000" },
    });

    io.on("connection", (socket) => {
      socket.on("setup", (userData) => {
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
      });

      socket.on("new message", (roomId, newMessageRecived) => {
        const chats = [
          newMessageRecived.sender._id,
          newMessageRecived.reciver._id,
        ];
        if (!roomId && !newMessageRecived.reciver)
          return console.log("user not defined");

        chats.forEach((item) => {
          if (item == newMessageRecived.sender._id) return;
          socket.in(roomId).emit("message recived", newMessageRecived);
        });
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  }
} else {
  console.log("error please add .env file to run this program💻💻💻");
  console.log("can't connect mongodb without mongo uri");
  console.log(
    JSON.stringify(
      {
        NODE_ENV:
          "production (if you want to host) or development (if you want to add or change something)",
        PORT: "PORT number",
        JWT_SECRET: "your jwt secret",
        MONGO_URI: "your mongodb uri",
      },
      null,
      2
    )
  );
}
