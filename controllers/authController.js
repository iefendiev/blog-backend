const passport = require("passport");
const jwt = require("jsonwebtoken");
const authServices = require("../services/authServices");
const validationServices = require("../services/validationServices");
const config = require("../config/config");
const User = require("../models/user");

// @desc      Authentication
// @route     POST /login
// @access    Public
exports.authenticate = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ status: "error", code: "Wrong username or password!" });
    return res.status(200).json({
      userID: user.id,
      token: jwt.sign({ id: user.id }, config.SECRET, { expiresIn: "9999y" }),
    });
  })(req, res, next);
};

// @desc      Register a user
// @route     POST /register
// @access    Private
exports.register = async (req, res) => {
  const { username, email, firstName, lastName } = req.body;
  var newUser = new User({ username, email, firstName, lastName });
  await User.register(newUser, req.body.password)
    .then((user) => {
      res.status(201).json({ userID: user._id });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Generate new password and send user an email
// @route     POST /password-recovery
// @access    Public
exports.passwordRecovery = async (req, res, next) => {
  const { email } = req.body;
  const { error } = validationServices.validateEmail(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  await User.findOne({ email: email })
    .then(async (user) => {
      if (!user) return res.status(404).json({ message: "User not found!" });
      const newPassword = authServices.passwordGenerator();
      user.setPassword(newPassword, () => {
        user.save();
      });
      await authServices.sendPasswordRecoveryMail(
        user.email,
        newPassword,
        next
      );
      res
        .status(200)
        .json({ message: "New password has been sent to your mail." });
    })
    .catch((err) => next(err));
};
