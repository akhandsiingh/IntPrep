const express = require("express")
const Interview = require("../models/Interview")
const User = require("../models/User")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// Create new interview
router.post("/", verifyToken, async (req, res) => {
  try {
    const { role, experience, difficulty, duration } = req.body

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const interview = new Interview({
      userId: user._id,
      firebaseUid: req.user.uid,
      role,
      experience,
      difficulty,
      duration,
    })

    await interview.save()
    res.status(201).json(interview)
  } catch (error) {
    console.error("Interview creation error:", error)
    res.status(500).json({ message: "Failed to create interview" })
  }
})

// Get user's interviews
router.get("/", verifyToken, async (req, res) => {
  try {
    const interviews = await Interview.find({ firebaseUid: req.user.uid }).sort({ createdAt: -1 }).limit(20)

    res.json(interviews)
  } catch (error) {
    console.error("Interviews fetch error:", error)
    res.status(500).json({ message: "Failed to fetch interviews" })
  }
})

// Get specific interview
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      firebaseUid: req.user.uid,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    res.json(interview)
  } catch (error) {
    console.error("Interview fetch error:", error)
    res.status(500).json({ message: "Failed to fetch interview" })
  }
})

// Update interview
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate({ _id: req.params.id, firebaseUid: req.user.uid }, req.body, {
      new: true,
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    res.json(interview)
  } catch (error) {
    console.error("Interview update error:", error)
    res.status(500).json({ message: "Failed to update interview" })
  }
})

module.exports = router
