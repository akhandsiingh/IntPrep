import axios from "axios"
import { auth } from "../config/firebase"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Error getting auth token:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const generateQuestions = async (transcript, interviewData, currentQuestion, context = "interview") => {
  try {
    const response = await api.post("/api/generate-questions", {
      transcript,
      interviewData,
      currentQuestion,
      context,
    })
    return response.data
  } catch (error) {
    console.error("Error generating questions:", error)
    throw error
  }
}

export const submitAnswer = async (answer, question, conversationHistory, interviewData) => {
  try {
    const response = await api.post("/api/submit-answer", {
      answer,
      question,
      conversationHistory,
      interviewData,
    })
    return response.data
  } catch (error) {
    console.error("Error submitting answer:", error)
    throw error
  }
}

export const answerQuestion = async (question, context) => {
  try {
    const response = await api.post("/api/answer-question", {
      question,
      context,
    })
    return response.data
  } catch (error) {
    console.error("Error answering question:", error)
    throw error
  }
}

export const analyzeSession = async (conversationHistory, interviewData) => {
  try {
    const response = await api.post("/api/analyze-session", {
      conversationHistory,
      interviewData,
    })
    return response.data
  } catch (error) {
    console.error("Error analyzing session:", error)
    throw error
  }
}

export const getAvailableModels = async () => {
  try {
    const response = await api.get("/api/models")
    return response.data
  } catch (error) {
    console.error("Error fetching models:", error)
    throw error
  }
}

export default api
