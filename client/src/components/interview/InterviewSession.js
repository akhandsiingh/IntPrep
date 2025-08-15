"use client"

import { useState, useEffect } from "react"
import { useToast } from "../../contexts/ToastContext"
import { Clock, MessageSquare, ArrowRight, Pause, Play, Sparkles } from "lucide-react"
import axios from "axios"

export default function InterviewSession({ config, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [interviewId, setInterviewId] = useState(null)
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false) // Added evaluation state

  const { toast } = useToast()

  // Generate questions and create interview
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setLoading(true)

        // Create interview record
        const interviewResponse = await axios.post("/api/interviews", config)
        setInterviewId(interviewResponse.data._id)

        // Generate questions
        const questionsResponse = await axios.post("/api/questions/generate", {
          ...config,
          count: Math.ceil(config.duration / 6), // Roughly 6 minutes per question
        })

        setQuestions(questionsResponse.data.questions)
        setLoading(false)
      } catch (error) {
        console.error("Failed to initialize interview:", error)
        toast.error("Failed to start interview. Please try again.")
        setLoading(false)
      }
    }

    initializeInterview()
  }, [config, toast])

  // Timer countdown
  useEffect(() => {
    if (loading || isPaused || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleCompleteInterview()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, isPaused, timeRemaining])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = async () => {
    setEvaluatingAnswer(true)

    try {
      // Evaluate current answer using Gemini AI
      const evaluationResponse = await axios.post("/api/questions/evaluate", {
        question: questions[currentQuestionIndex],
        answer,
        role: config.role,
        experience: config.experience,
      })

      const evaluation = evaluationResponse.data

      const newAnswers = [
        ...answers,
        {
          question: questions[currentQuestionIndex],
          answer,
          timeSpent: 0,
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        },
      ]

      setAnswers(newAnswers)
      setAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        await handleCompleteInterview(newAnswers)
      }
    } catch (error) {
      console.error("Failed to evaluate answer:", error)
      // Continue without evaluation
      const newAnswers = [...answers, { question: questions[currentQuestionIndex], answer, timeSpent: 0 }]
      setAnswers(newAnswers)
      setAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        await handleCompleteInterview(newAnswers)
      }
    } finally {
      setEvaluatingAnswer(false)
    }
  }

  const handleCompleteInterview = async (finalAnswers = answers) => {
    try {
      const averageScore =
        finalAnswers.length > 0 ? finalAnswers.reduce((sum, a) => sum + (a.score || 7), 0) / finalAnswers.length : 7

      // Generate comprehensive feedback
      const feedbackResponse = await axios.post("/api/questions/feedback", {
        questions: finalAnswers.map((a) => a.question),
        answers: finalAnswers.map((a) => a.answer),
        role: config.role,
        experience: config.experience,
        overallScore: averageScore,
      })

      const comprehensiveFeedback = feedbackResponse.data

      const interviewData = {
        questions: finalAnswers,
        status: "completed",
        completedAt: new Date(),
        overallScore: averageScore,
        feedback: comprehensiveFeedback,
      }

      if (interviewId) {
        await axios.put(`/api/interviews/${interviewId}`, interviewData)
      }

      onComplete({
        ...config,
        ...interviewData,
        timeSpent: config.duration * 60 - timeRemaining,
      })
    } catch (error) {
      console.error("Failed to complete interview:", error)
      toast.error("Failed to save interview results")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generating your personalized questions...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Failed to generate questions. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">{formatTime(timeRemaining)}</span>
                </div>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <div className="flex items-center gap-2 text-purple-600 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{questions[currentQuestionIndex]}</h2>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Be specific and provide examples when possible."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isPaused || evaluatingAnswer}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{answer.length} characters</span>
                  <span>💡 Tip: Include specific examples and quantify your achievements</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {answers.length > 0 && `${answers.length} question${answers.length > 1 ? "s" : ""} completed`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCompleteInterview()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={evaluatingAnswer}
              >
                End Interview
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!answer.trim() || isPaused || evaluatingAnswer}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {evaluatingAnswer ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Evaluating...
                  </>
                ) : (
                  <>
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Interview"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
