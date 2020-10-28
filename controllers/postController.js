const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");
const validationServices = require("../services/validationServices");

// @desc      Create a Post
// @route     POST /posts
// @access    Private
exports.createPost = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title, content } = req.body;
  let authorID;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbiden" });
      }
      authorID = user.id;
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }

  const { error } = validationServices.validatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  await User.findById(authorID).then(async (user) => {
    if (!user) {
      return res.status(404).json({ message: "There is no such user" });
    }
    await Post.create({
      title: title,
      content: content,
      author: authorID,
    })
      .then((createdPost) => {
        if (!createdPost) {
          return res
            .status(400)
            .json({ message: "Post could not be created." });
        }
        user.posts.push(createdPost);
        user.save();
        res.status(201).json({ message: "Post is successfully created. " });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  });
};

// @desc      Get Posts
// @route     GET /posts
// @access    Private
exports.getAllPosts = async (req, res) => {
  await Post.find({})
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({ message: "Posts are not found." });
      }
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Get a specific post
// @route     GET /posts/:id
// @access    Private
exports.getPost = async (req, res) => {
  await Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post is not found." });
      }
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Delete a specific post
// @route     DELETE /posts/:id
// @access    Private
exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
    .then(async (deletedPost) => {
      if (!deletedPost) {
        return res.status(404).json({ message: "Could not find the post." });
      }
      await User.findById(deletedPost.author).then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "Could not find the post's user." });
        }
        user.posts.remove(req.params.id);
        user.save();
      });

      res.status(200).json({ message: "Post is successfully deleted." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// @desc      Update a specific Post
// @route     PUT /posts/:id
// @access    Private
exports.updatePost = async (req, res) => {
  const { title, content } = req.body;

  const { error } = validationServices.validatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  await Post.findOneAndUpdate({
    id: req.params.id,
    $set: { content: content, title: title },
  })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post is not found ." });
      }
      res.status(200).json({ message: "Post is successfully updated." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
