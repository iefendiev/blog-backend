const express = require("express");
const ejwt = require("express-jwt");
const passport = require("passport");
const passportConfig = require("./config/passport");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");

const errorHandler = require("./helpers/errors/errorHandler");
const connectDB = require("./config/db.js");
const config = require("./config/config");
const app = express();

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(
  ejwt({
    secret: config.SECRET,
    algorithms: ["HS256"],
    userProperty: "tokenPayload",
  }).unless({
    path: [
      "/login",
      "/password-recovery",
      { url: "/posts", methods: ["GET"] },
      { url: /^\/posts\/([^]*)$/, methods: ["GET"] },
    ],
  })
);

passportConfig(passport);
app.use(passport.initialize());

app.use(methodOverride("_method"));

app.use("/", auth);
app.use("/users", users);
app.use("/posts", posts);
app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found!" });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

connectDB();

// Listen
app.listen(config.PORT, () => {
  console.log(`Listening at http://localhost:${config.PORT}`);
});
