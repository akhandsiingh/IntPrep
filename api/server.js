
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Initialize Firebase Admin (you'll need to add your service account key)
// Uncomment and configure when you have Firebase credentials
/*
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
*/

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    // Uncomment when Firebase is configured
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;

    next()
  } catch (error) {
    console.error("Token verification error:", error)
    return res.status(401).json({ error: "Invalid token" })
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "IntPrep server is running" })
})

// Generate interview questions endpoint
app.post("/api/generate-questions", async (req, res) => {
  try {
    const { transcript, interviewData, currentQuestion, context } = req.body

    if (!transcript || transcript.trim().length === 0) {
      return res.json({ questions: [] })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    let prompt = ""

    if (context === "interview" && interviewData) {
      prompt = `You are conducting a ${interviewData.interviewType || "general"} interview for a ${interviewData.position} position. 
      
Candidate Info:
- Name: ${interviewData.name}
- Position: ${interviewData.position}
- Experience: ${interviewData.experience}
- Background: ${interviewData.background}

Current Question: "${currentQuestion}"
Candidate's Response: "${transcript}"

Based on the candidate's response, generate 2-3 relevant follow-up questions that:
1. Dig deeper into their experience or skills mentioned
2. Ask for specific examples or clarifications
3. Are appropriate for their experience level
4. Help assess their fit for the ${interviewData.position} role

Make the questions professional, engaging, and interview-appropriate.

Return only the questions, one per line, without numbering or bullet points.`
    } else {
      prompt = `Based on this speech transcript, generate 2-3 relevant questions that would help continue the conversation or clarify important points. Make the questions engaging and thought-provoking.

Transcript: "${transcript}"

Return only the questions, one per line, without numbering or bullet points.`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const questions = text.split("\n").filter((q) => q.trim().length > 0)
    console.log("Successfully generated AI questions:", questions)

    res.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)

    const fallbackQuestions = [
      "Can you tell me more about your experience with that?",
      "What challenges did you face in that situation?",
      "How do you think that experience prepared you for this role?",
      "What specific skills did you develop from that experience?",
      "How would you handle a similar situation in the future?",
      "What was the most valuable lesson you learned from that?",
    ]

    const selectedQuestions = fallbackQuestions.sort(() => 0.5 - Math.random()).slice(0, 3)

    res.json({
      questions: selectedQuestions,
      note: "Using fallback questions due to API error",
    })
  }
})

// Answer question endpoint
app.post("/api/answer-question", async (req, res) => {
  try {
    const { question, context } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Answer this question based on the provided context. Give a concise, helpful answer.

Context: "${context}"
Question: "${question}"

Provide a clear, informative answer in 2-3 sentences.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    res.json({ answer: text })
  } catch (error) {
    console.error("Error generating answer:", error)
    res.status(500).json({ error: "Failed to generate answer" })
  }
})

// Text-based interview flow endpoint
app.post("/api/submit-answer", async (req, res) => {
  try {
    const { answer, question, conversationHistory, interviewData } = req.body

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({ error: "Answer is required" })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg) => `${msg.role === "user" ? "Candidate" : "Interviewer"}: ${msg.content}`)
      .join("\n")

    const questionCount = conversationHistory.filter((msg) => msg.role === "assistant").length

    const shouldEnd = questionCount >= 10

    let prompt = ""

    if (shouldEnd) {
      prompt = `You are conducting a ${interviewData.interviewType || "general"} interview for a ${interviewData.position} position.

Candidate Info:
- Name: ${interviewData.name}
- Position: ${interviewData.position}
- Experience: ${interviewData.experience}
- Background: ${interviewData.background}

Conversation History:
${conversationContext}

Current Question: "${question}"
Candidate's Answer: "${answer}"

The interview is now complete. Provide brief feedback on this final answer (2-3 sentences) and thank the candidate.

Return your response in this exact JSON format:
{
  "feedback": "Your feedback here",
  "nextQuestion": null,
  "isComplete": true
}`
    } else {
      prompt = `You are conducting a ${interviewData.interviewType || "general"} interview for a ${interviewData.position} position.

Candidate Info:
- Name: ${interviewData.name}
- Position: ${interviewData.position}
- Experience: ${interviewData.experience}
- Background: ${interviewData.background}

Conversation History:
${conversationContext}

Current Question: "${question}"
Candidate's Answer: "${answer}"

Based on the candidate's answer:
1. Provide brief, constructive feedback (1-2 sentences) on their response
2. Generate the next relevant interview question that:
   - Builds on their previous answers
   - Explores different aspects of their experience
   - Is appropriate for a ${interviewData.position} role
   - Matches their ${interviewData.experience} experience level

Return your response in this exact JSON format:
{
  "feedback": "Your feedback here",
  "nextQuestion": "Your next question here",
  "isComplete": false
}`
    }

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse JSON response with better error handling
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0])
        res.json(parsedResponse)
      } else {
        // Fallback if JSON parsing fails
        res.json({
          feedback: "Thank you for your answer.",
          nextQuestion: shouldEnd ? null : "Can you tell me more about your experience?",
          isComplete: shouldEnd,
        })
      }
    } catch (apiError) {
      console.error("API Error in submit-answer:", apiError.message)
      res.json({
        feedback: "Thank you for your response.",
        nextQuestion: shouldEnd ? null : "Can you tell me more about your experience?",
        isComplete: shouldEnd,
      })
    }
  } catch (error) {
    console.error("Error processing answer:", error)
    res.json({
      feedback: "Thank you for your response.",
      nextQuestion: null,
      isComplete: true,
    })
  }
})

// Analyze session endpoint updated to work with conversation history
app.post("/api/analyze-session", async (req, res) => {
  try {
    const { conversationHistory, interviewData } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const conversationContext = conversationHistory
      .map((msg) => `${msg.role === "user" ? "Candidate" : "Interviewer"}: ${msg.content}`)
      .join("\n\n")

    const prompt = `Analyze this complete interview session for a ${interviewData.position} candidate with ${interviewData.experience} experience.

Candidate Profile:
- Name: ${interviewData.name}
- Position: ${interviewData.position}
- Experience Level: ${interviewData.experience}
- Background: ${interviewData.background}

Complete Interview Conversation:
${conversationContext}

Provide a detailed interview score out of 10 based on:
- Communication Clarity (2 points): How clear and articulate were the responses?
- Relevance (2 points): How well did answers relate to the questions asked?
- Experience & Examples (2 points): Did they provide specific examples and demonstrate real experience?
- Professionalism (2 points): How professional and appropriate was their demeanor?
- Problem-Solving (1 point): Did they show critical thinking where applicable?
- Overall Fit (1 point): Do they seem like a good fit for the ${interviewData.position} role?

Then provide comprehensive feedback in the following format:

OVERALL SCORE: [Provide score out of 10]

STRENGTHS: [List 3-4 specific positive aspects of their responses]

AREAS FOR IMPROVEMENT: [List 3-4 specific suggestions for better performance]

KEY OBSERVATIONS: [List 2-3 notable patterns or standout moments]

RECOMMENDATION: [Brief recommendation on whether to proceed]`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      let score = null
      const scoreMatch = text.match(/OVERALL SCORE:\s*(\d+(?:\.\d+)?)\s*(?:\/10)?/i)
      if (scoreMatch) {
        score = Math.min(10, Math.max(0, Number.parseFloat(scoreMatch[1])))
      } else {
        // Fallback: Extract from out of 100 format for backwards compatibility
        const scoreMatch100 = text.match(/INTERVIEW SCORE:\s*(\d+)/i)
        if (scoreMatch100) {
          score = Math.round(Number.parseFloat(scoreMatch100[1]) / 10)
        }
      }

      if (!score) {
        score = calculateFallbackScore(conversationHistory)
      }

      res.json({ analysis: text, score })
    } catch (apiError) {
      console.error("API Error in analyze-session:", apiError.message)
      const fallbackScore = calculateFallbackScore(conversationHistory)
      const fallbackAnalysis = generateFallbackAnalysis(conversationHistory, interviewData, fallbackScore)
      res.json({ analysis: fallbackAnalysis, score: fallbackScore })
    }
  } catch (error) {
    console.error("Error analyzing session:", error)
    const fallbackScore = calculateFallbackScore(req.body.conversationHistory || [])
    const fallbackAnalysis = generateFallbackAnalysis(
      req.body.conversationHistory || [],
      req.body.interviewData || {},
      fallbackScore,
    )
    res.json({ analysis: fallbackAnalysis, score: fallbackScore })
  }
})

function calculateFallbackScore(conversationHistory) {
  const userResponses = conversationHistory.filter((msg) => msg.role === "user")
  const questionCount = conversationHistory.filter((msg) => msg.role === "assistant").length

  if (userResponses.length === 0) {
    return 1
  }

  // Calculate average response quality
  let score = 2 // Base score starts lower
  const totalLength = userResponses.reduce((sum, msg) => sum + msg.content.length, 0)
  const avgLength = totalLength / userResponses.length

  // Add points only for substantive responses
  if (avgLength > 50) score += 1 // Basic effort
  if (avgLength > 150) score += 1.5 // Good detail
  if (avgLength > 300) score += 2 // Excellent detail
  if (userResponses.length > 3) score += 1 // Multiple questions
  if (userResponses.length > 6) score += 1.5 // Many questions

  return Math.min(10, Math.max(1, score))
}

function generateFallbackAnalysis(conversationHistory, interviewData, score) {
  const userResponses = conversationHistory.filter((msg) => msg.role === "user")
  const questionCount = conversationHistory.filter((msg) => msg.role === "assistant").length
  const totalLength = userResponses.reduce((sum, msg) => sum + msg.content.length, 0)
  const avgLength = Math.round(totalLength / Math.max(userResponses.length, 1))

  let strengths = "- Showed up and attempted the interview"
  let improvements = ""
  let observations = ""
  let recommendation = "Review feedback to improve for next interview"

  if (userResponses.length === 1) {
    strengths = "- Initiated the interview process"
    improvements = `- Responses were very brief (average ${avgLength} characters). Provide detailed answers with examples\n- Expand on each question to demonstrate knowledge and experience\n- Give context, challenges faced, and outcomes in your answers`
    observations = `- Only 1 response provided\n- Limited information to evaluate interview performance\n- Need more engagement to properly assess candidacy`
    recommendation = "Provide more detailed responses to showcase your qualifications"
  } else if (userResponses.length <= 3) {
    strengths = `- Provided ${userResponses.length} responses to interview questions`
    improvements = `- Average response length of ${avgLength} characters is relatively brief\n- Include specific examples and measurable outcomes\n- Demonstrate how your experience relates to the ${interviewData.position} role`
    observations = `- Completed ${userResponses.length} out of expected questions\n- Responses lacked depth in some areas\n- Limited examples provided to support answers`
    recommendation = "Practice providing structured, detailed responses with concrete examples"
  } else if (userResponses.length <= 6) {
    strengths = `- Engaged with ${userResponses.length} questions showing commitment\n- Average response length of ${avgLength} characters shows effort\n- Demonstrated willingness to articulate experience`
    improvements = `- Enhance responses with specific metrics and outcomes\n- Provide more context about challenges and solutions\n- Connect experiences directly to the ${interviewData.position} role requirements`
    observations = `- Completed ${userResponses.length} interview questions\n- Moderate level of detail in responses\n- Some responses could benefit from more specific examples`
    recommendation = "Strengthen interview skills by preparing concrete examples and using the STAR method"
  } else {
    strengths = `- Strong participation completing ${userResponses.length} questions\n- Average response length of ${avgLength} characters shows comprehensive thinking\n- Demonstrated engagement throughout the interview`
    improvements = `- Review technical depth for ${interviewData.position} specific skills\n- Consider preparing more quantifiable achievements\n- Practice concise delivery while maintaining detail`
    observations = `- Successfully completed full interview with ${questionCount} questions asked\n- Consistent engagement and response quality\n- Good overall communication demonstrated`
    recommendation = "Strong interview performance. Continue practicing to refine technical knowledge"
  }

  return `OVERALL SCORE: ${score.toFixed(1)}/10

STRENGTHS:
${strengths}

AREAS FOR IMPROVEMENT:
${improvements}

KEY OBSERVATIONS:
${observations}

RECOMMENDATION:
${recommendation}`
}

// List available Gemini models endpoint
app.get("/api/models", async (req, res) => {
  try {
    // Return the models list similar to the format in the pasted text
    const models = [
      {
        name: "models/gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        description: "Fast and versatile performance across a diverse variety of tasks",
      },
      {
        name: "models/gemini-2.0-flash-exp",
        displayName: "Gemini 2.0 Flash Experimental",
        description: "Experimental version with enhanced capabilities",
      },
      {
        name: "models/gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        description: "Latest stable version with improved performance",
      },
    ]

    res.json({ models })
  } catch (error) {
    console.error("Error fetching models:", error)
    res.status(500).json({ error: "Failed to fetch models" })
  }
})

app.listen(PORT, () => {
  console.log(`IntPrep server running on port ${PORT}`)
})
