const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

// ✅ Get posts of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }); // ✅ Fixed here
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new post (only by logged-in user)
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({
      user: req.user.id,  // ✅ Only user ID saved
      title,
      content,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// ✅ Delete post (only by its owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,  // ✅ Match by user ID
    });

    if (!post) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

// ✅ Update post (only by its owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

