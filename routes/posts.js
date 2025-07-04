const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

// 📌 Get posts of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


// POST /api/posts → create new post (protected)
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({
      user: req.user,         // user id from auth middleware
      title,
      content,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
});
