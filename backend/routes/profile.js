const express = require("express");
const { authenticateUser } = require("../middleware/auth"); // ✅ Destructure the function
const User = require("../models/User");

const router = express.Router();

router.get("/", authenticateUser, (req, res) => {
  res.json(req.user);
});

// PUT route to update user profile
router.put("/", authenticateUser, async (req, res) => {
  try {
    const { fullName, title } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName.trim(),
        ...(title && { title: title.trim() })
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
