const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

// 📌 Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 📌 Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 Forgot Password Route
// FOR DEV: Return token in response (in real case, email it)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found with this email" });

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Save to DB (optional: helps with validation)
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // FOR NOW: Send token back in response (later use nodemailer to email it)
    res.status(200).json({
      message: "Reset token generated.",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 Reset Password Route

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
