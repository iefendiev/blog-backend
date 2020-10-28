const express = require("express");

const userController = require("../controllers/userController");

const Router = express.Router();

Router.route("/").get(userController.getAllUsers);
Router.route("/:id").get(userController.getUser);
Router.route("/:id/update-email").put(userController.updateUserEmail);
Router.route("/:id/update-password").put(userController.updateUserPassword);

module.exports = Router;
