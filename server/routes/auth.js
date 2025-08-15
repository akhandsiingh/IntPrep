const express = require("express")
const User = require("../models/User")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// Create or update user profile
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.user

    let user = await User.findOne({ firebaseUid: uid })

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email: email,
        displayName: displayName || "Anonymous User",
        profilePicture: photoURL || "",
      })
    } else {
      user.email = email
      user.displayName = displayName || user.displayName
      user.profilePicture = photoURL || user.profilePicture
    }

    await user.save()
    res.json(user)
  } catch (error) {
    console.error("Profile creation error:", error)
    res.status(500).json({ message: "Failed to create/update profile" })
  }
})

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ message: "Failed to fetch profile" })
  }
})

module.exports = router
