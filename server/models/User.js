const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    preferences: {
      defaultRole: {
        type: String,
        default: "Software Engineer",
      },
      defaultExperience: {
        type: String,
        default: "Mid-level",
      },
      defaultDifficulty: {
        type: String,
        default: "Medium",
      },
    },
    stats: {
      totalInterviews: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      totalTimeSpent: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
