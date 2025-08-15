const mongoose = require("mongoose")

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firebaseUid: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          default: "",
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Interview", interviewSchema)
