const express = require("express")
const User = require("../models/User")
const Interview = require("../models/Interview")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// Get user statistics
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const interviews = await Interview.find({ firebaseUid: req.user.uid })

    const stats = {
      totalInterviews: interviews.length,
      completedInterviews: interviews.filter((i) => i.status === "completed").length,
      averageScore:
        interviews.length > 0 ? interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length : 0,
      totalTimeSpent: interviews.reduce((sum, i) => sum + (i.duration || 0), 0),
      recentInterviews: interviews.slice(0, 5),
    }

    res.json(stats)
  } catch (error) {
    console.error("Stats fetch error:", error)
    res.status(500).json({ message: "Failed to fetch user statistics" })
  }
})

// Update user preferences
router.put("/preferences", verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ firebaseUid: req.user.uid }, { preferences: req.body }, { new: true })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Preferences update error:", error)
    res.status(500).json({ message: "Failed to update preferences" })
  }
})

module.exports = router
