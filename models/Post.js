const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);
// This code defines a Mongoose schema for a Post model in a Node.js application.
// The schema includes fields for user (referencing the User model), title, content, and createdAt timestamp.
// The Post model is then exported for use in other parts of the application.