const express = require("express");

const postController = require("../controllers/postController");

const Router = express.Router();

Router.route("/").get(postController.getAllPosts);

Router.route("/:id").get(postController.getPost);

Router.route("/").post(postController.createPost);

Router.route("/:id").put(postController.updatePost);

Router.route("/:id").delete(postController.deletePost);

module.exports = Router;
