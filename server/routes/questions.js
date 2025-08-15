const express = require("express")
const axios = require("axios")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// Generate questions using Gemini AI
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { role, experience, difficulty, count = 5 } = req.body

    // IMPORTANT: Add your GEMINI_API_KEY environment variable
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      // Fallback questions if API key is not configured
      const fallbackQuestions = [
        "Tell me about yourself and your background.",
        `What interests you about the ${role} position?`,
        "Describe a challenging project you've worked on.",
        "How do you handle working under pressure?",
        "Where do you see yourself in 5 years?",
      ]

      return res.json({ questions: fallbackQuestions.slice(0, count) })
    }

    // Enhanced prompt with specific categories and better structure
    const prompt = `Generate ${count} diverse interview questions for a ${experience} ${role} position with ${difficulty.toLowerCase()} difficulty level.

Include a mix of:
- Technical/Skills questions (40%)
- Behavioral/Situational questions (30%) 
- Problem-solving scenarios (20%)
- Career/Motivation questions (10%)

Guidelines:
- Make questions specific to ${role} responsibilities
- Adjust complexity for ${experience} level
- ${
      difficulty === "Easy"
        ? "Focus on fundamental concepts and basic scenarios"
        : difficulty === "Medium"
          ? "Include moderate complexity with real-world applications"
          : "Challenge with advanced concepts and complex problem-solving"
    }
- Avoid generic questions
- Each question should be clear and actionable

Return only the questions, one per line, without numbering or additional formatting.`

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const generatedText = response.data.candidates[0].content.parts[0].text
    const questions = generatedText
      .split("\n")
      .filter((q) => q.trim().length > 0)
      .map((q) => q.replace(/^\d+\.\s*/, "").trim()) // Remove numbering if present

    res.json({ questions: questions.slice(0, count) })
  } catch (error) {
    console.error("Question generation error:", error)

    // Enhanced fallback questions based on role and experience
    const fallbackQuestions = generateFallbackQuestions(req.body.role, req.body.experience, req.body.difficulty)

    res.json({ questions: fallbackQuestions.slice(0, req.body.count || 5) })
  }
})

router.post("/evaluate", verifyToken, async (req, res) => {
  try {
    const { question, answer, role, experience } = req.body

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.json({
        score: Math.floor(Math.random() * 3) + 7, // Mock score 7-10
        feedback: "AI evaluation is not available. Your answer has been recorded.",
        strengths: ["Answer provided"],
        improvements: ["Consider adding more specific examples"],
      })
    }

    const evaluationPrompt = `Evaluate this interview answer for a ${experience} ${role} position:

Question: "${question}"
Answer: "${answer}"

Provide evaluation in this exact format:
SCORE: [number from 1-10]
FEEDBACK: [2-3 sentences of constructive feedback]
STRENGTHS: [2-3 specific strengths, separated by semicolons]
IMPROVEMENTS: [2-3 specific improvement suggestions, separated by semicolons]

Evaluation criteria:
- Relevance and directness to the question
- Technical accuracy (if applicable)
- Communication clarity
- Use of specific examples
- Appropriate depth for ${experience} level`

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: evaluationPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 512,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const evaluationText = response.data.candidates[0].content.parts[0].text
    const evaluation = parseEvaluation(evaluationText)

    res.json(evaluation)
  } catch (error) {
    console.error("Answer evaluation error:", error)
    res.json({
      score: Math.floor(Math.random() * 3) + 7,
      feedback: "Unable to evaluate answer at this time. Your response has been recorded.",
      strengths: ["Answer provided"],
      improvements: ["Consider adding more detail"],
    })
  }
})

router.post("/feedback", verifyToken, async (req, res) => {
  try {
    const { questions, answers, role, experience, overallScore } = req.body

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.json({
        overallFeedback: "Great job completing the interview! Keep practicing to improve your skills.",
        keyStrengths: ["Completed all questions", "Showed engagement"],
        areasForImprovement: ["Practice more technical questions", "Provide more specific examples"],
        recommendations: ["Review common interview questions", "Practice with mock interviews"],
      })
    }

    const feedbackPrompt = `Generate comprehensive interview feedback for a ${experience} ${role} candidate:

Overall Score: ${overallScore}/10

Questions and Answers:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer provided"}`).join("\n\n")}

Provide feedback in this exact format:
OVERALL_FEEDBACK: [3-4 sentences summarizing performance]
KEY_STRENGTHS: [3-4 specific strengths, separated by semicolons]
AREAS_FOR_IMPROVEMENT: [3-4 specific areas to work on, separated by semicolons]
RECOMMENDATIONS: [3-4 actionable recommendations, separated by semicolons]

Focus on:
- Communication skills and clarity
- Technical knowledge demonstration
- Problem-solving approach
- Professional presentation
- Specific examples and evidence`

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: feedbackPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 30,
          topP: 0.9,
          maxOutputTokens: 800,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const feedbackText = response.data.candidates[0].content.parts[0].text
    const feedback = parseFeedback(feedbackText)

    res.json(feedback)
  } catch (error) {
    console.error("Feedback generation error:", error)
    res.json({
      overallFeedback: "Thank you for completing the interview. Continue practicing to enhance your interview skills.",
      keyStrengths: ["Engagement", "Completion"],
      areasForImprovement: ["Technical depth", "Specific examples"],
      recommendations: ["Practice more", "Study role requirements"],
    })
  }
})

// Helper function to generate role-specific fallback questions
function generateFallbackQuestions(role, experience, difficulty) {
  const baseQuestions = [
    "Tell me about yourself and your background.",
    `What interests you about the ${role} position?`,
    "Describe a challenging project you've worked on.",
    "How do you handle working under pressure?",
    "Where do you see yourself in 5 years?",
  ]

  const roleSpecificQuestions = {
    "Software Engineer": [
      "Explain the difference between synchronous and asynchronous programming.",
      "How do you approach debugging a complex issue?",
      "Describe your experience with version control systems.",
    ],
    "Frontend Developer": [
      "How do you ensure cross-browser compatibility?",
      "Explain the concept of responsive design.",
      "What's your approach to optimizing web performance?",
    ],
    "Backend Developer": [
      "How do you design scalable APIs?",
      "Explain database indexing and its importance.",
      "Describe your experience with microservices architecture.",
    ],
    "Data Scientist": [
      "How do you handle missing data in datasets?",
      "Explain the bias-variance tradeoff.",
      "Describe your approach to feature selection.",
    ],
  }

  const specificQuestions = roleSpecificQuestions[role] || []
  return [...baseQuestions, ...specificQuestions]
}

// Helper function to parse AI evaluation response
function parseEvaluation(text) {
  const lines = text.split("\n")
  const result = {
    score: 7,
    feedback: "Good answer provided.",
    strengths: ["Answer provided"],
    improvements: ["Consider adding more detail"],
  }

  lines.forEach((line) => {
    if (line.startsWith("SCORE:")) {
      const score = Number.parseInt(line.replace("SCORE:", "").trim())
      if (!isNaN(score) && score >= 1 && score <= 10) {
        result.score = score
      }
    } else if (line.startsWith("FEEDBACK:")) {
      result.feedback = line.replace("FEEDBACK:", "").trim()
    } else if (line.startsWith("STRENGTHS:")) {
      result.strengths = line
        .replace("STRENGTHS:", "")
        .trim()
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    } else if (line.startsWith("IMPROVEMENTS:")) {
      result.improvements = line
        .replace("IMPROVEMENTS:", "")
        .trim()
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
  })

  return result
}

// Helper function to parse AI feedback response
function parseFeedback(text) {
  const lines = text.split("\n")
  const result = {
    overallFeedback: "Thank you for completing the interview.",
    keyStrengths: ["Engagement"],
    areasForImprovement: ["Technical depth"],
    recommendations: ["Continue practicing"],
  }

  lines.forEach((line) => {
    if (line.startsWith("OVERALL_FEEDBACK:")) {
      result.overallFeedback = line.replace("OVERALL_FEEDBACK:", "").trim()
    } else if (line.startsWith("KEY_STRENGTHS:")) {
      result.keyStrengths = line
        .replace("KEY_STRENGTHS:", "")
        .trim()
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    } else if (line.startsWith("AREAS_FOR_IMPROVEMENT:")) {
      result.areasForImprovement = line
        .replace("AREAS_FOR_IMPROVEMENT:", "")
        .trim()
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    } else if (line.startsWith("RECOMMENDATIONS:")) {
      result.recommendations = line
        .replace("RECOMMENDATIONS:", "")
        .trim()
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
  })

  return result
}

module.exports = router
