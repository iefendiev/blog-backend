const User = require("../models/user");
const validationServices = require("../services/validationServices");

// @desc      Get all users
// @route     GET /users
// @access    Private
exports.getAllUsers = async (req, res) => {
  await User.find({})
    .then((users) => {
      if (!users) {
        res.status(404).json({ message: "Users not found" });
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Get one specific user according to id
// @route     GET /users/:id
// @access    Private
exports.getUser = async (req, res) => {
  await User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Update a specific user according to id
// @route     PUT /users/:id/password
// @access    Private
exports.updateUserPassword = async (req, res) => {
  const password = req.body.password;
  const { error } = validationServices.validatePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  await User.findOne({ _id: req.params.id }).then(
    (user) => {
      if (!user) {
        return res.status(404).json({ message: "This user does not exist" });
      }
      user.setPassword(password, () => {
        user.save();
        res.status(200).json({ message: "password reset successful" });
      });
    },
    (err) => {
      res.status(500).json({ message: err.message });
    }
  );
};

// @desc      Update a specific user according to id
// @route     PUT /users/:id/email
// @access    Private
exports.updateUserEmail = async (req, res) => {
  const email = req.body.email;
  const { error } = validationServices.validateEmail(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { email: email } }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User email is updated!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
