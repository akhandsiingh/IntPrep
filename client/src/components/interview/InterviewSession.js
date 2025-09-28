import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { Clock, MessageSquare, ArrowRight, Pause, Play, Sparkles } from 'lucide-react'
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
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false)
  const [questionGenerationError, setQuestionGenerationError] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  // <CHANGE> Enhanced question generation with better error handling and dynamic AI generation
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setLoading(true)
        setQuestionGenerationError(false)

        // Set up axios defaults with auth token
        const token = await user.getIdToken()
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        console.log("[v0] Starting interview initialization with config:", config)

        // Create interview record
        const interviewResponse = await axios.post("/api/interviews", {
          ...config,
          userId: user.uid,
          startedAt: new Date(),
          status: "in_progress"
        })
        
        console.log("[v0] Interview created:", interviewResponse.data)
        setInterviewId(interviewResponse.data._id)

        // <CHANGE> Generate dynamic questions with enhanced parameters for variety
        const questionsResponse = await axios.post("/api/questions/generate", {
          role: config.role,
          experience: config.experience,
          difficulty: config.difficulty,
          count: Math.max(3, Math.ceil(config.duration / 6)), // At least 3 questions, roughly 6 minutes per question
          // Add randomization seed based on current time to ensure different questions each time
          seed: Date.now(),
          previousAnswers: [], // Start with empty array, will be populated for follow-up questions
        })

        console.log("[v0] Questions generated:", questionsResponse.data)
        
        if (questionsResponse.data.questions && questionsResponse.data.questions.length > 0) {
          setQuestions(questionsResponse.data.questions)
          toast.success(`Generated ${questionsResponse.data.questions.length} personalized questions!`)
        } else {
          throw new Error("No questions received from API")
        }

        setLoading(false)
      } catch (error) {
        console.error("[v0] Failed to initialize interview:", error)
        setQuestionGenerationError(true)
        
        // <CHANGE> Enhanced fallback with more variety
        const fallbackQuestions = generateFallbackQuestions(config)
        setQuestions(fallbackQuestions)
        
        toast.error("AI question generation failed. Using backup questions.")
        setLoading(false)
      }
    }

    initializeInterview()
  }, [config, user, toast])

  // <CHANGE> Enhanced fallback question generation with more variety
  const generateFallbackQuestions = (config) => {
    const baseQuestions = [
      `Tell me about yourself and why you're interested in the ${config.role} position.`,
      `What experience do you have that makes you suitable for this ${config.role} role?`,
      "Describe a challenging project you worked on and how you overcame the obstacles.",
      "How do you stay updated with the latest trends and technologies in your field?",
      "Tell me about a time when you had to work under pressure. How did you handle it?"
    ]

    const roleSpecificQuestions = {
      "Software Engineer": [
        "Explain the difference between synchronous and asynchronous programming.",
        "How do you approach debugging a complex issue in your code?",
        "Describe your experience with version control systems like Git.",
        "What's your preferred development methodology and why?"
      ],
      "Frontend Developer": [
        "How do you ensure cross-browser compatibility in your applications?",
        "Explain the concept of responsive design and how you implement it.",
        "What's your approach to optimizing web performance?",
        "How do you handle state management in complex applications?"
      ],
      "Backend Developer": [
        "How do you design scalable APIs?",
        "Explain database indexing and its importance for performance.",
        "Describe your experience with microservices architecture.",
        "How do you handle security in backend applications?"
      ],
      "Data Scientist": [
        "How do you handle missing data in datasets?",
        "Explain the bias-variance tradeoff in machine learning.",
        "Describe your approach to feature selection and engineering.",
        "How do you validate and test your machine learning models?"
      ]
    }

    const specificQuestions = roleSpecificQuestions[config.role] || []
    const allQuestions = [...baseQuestions, ...specificQuestions]
    
    // Shuffle and return appropriate number of questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.max(3, Math.ceil(config.duration / 6)))
  }

  // ... existing code ...

  // <CHANGE> Enhanced answer handling with better AI evaluation and follow-up question generation
  const handleNextQuestion = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before proceeding.")
      return
    }

    setEvaluatingAnswer(true)

    try {
      console.log("[v0] Evaluating answer for question:", questions[currentQuestionIndex])

      // Evaluate current answer using Gemini AI
      const evaluationResponse = await axios.post("/api/questions/evaluate", {
        question: questions[currentQuestionIndex],
        answer: answer.trim(),
        role: config.role,
        experience: config.experience,
      })

      console.log("[v0] Answer evaluation received:", evaluationResponse.data)

      const evaluation = evaluationResponse.data
      const newAnswer = {
        question: questions[currentQuestionIndex],
        answer: answer.trim(),
        timeSpent: 0,
        score: evaluation.score || 7,
        feedback: evaluation.feedback || "Good answer provided.",
        strengths: evaluation.strengths || ["Answer provided"],
        improvements: evaluation.improvements || ["Consider adding more detail"],
        timestamp: new Date()
      }

      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)

      // <CHANGE> Generate follow-up questions dynamically based on previous answers
      if (currentQuestionIndex < questions.length - 1) {
        // Check if we should generate a follow-up question based on the answer
        if (evaluation.score >= 8 && updatedAnswers.length < Math.ceil(config.duration / 4)) {
          try {
            const followUpResponse = await axios.post("/api/questions/generate", {
              role: config.role,
              experience: config.experience,
              difficulty: config.difficulty,
              count: 1,
              previousAnswers: updatedAnswers.map(a => ({
                question: a.question,
                answer: a.answer,
                score: a.score
              })),
              generateFollowUp: true
            })

            if (followUpResponse.data.questions && followUpResponse.data.questions.length > 0) {
              const newQuestions = [...questions]
              newQuestions.splice(currentQuestionIndex + 1, 0, followUpResponse.data.questions[0])
              setQuestions(newQuestions)
              console.log("[v0] Generated follow-up question:", followUpResponse.data.questions[0])
            }
          } catch (followUpError) {
            console.log("[v0] Follow-up question generation failed, continuing with existing questions")
          }
        }

        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer("")
      } else {
        await handleCompleteInterview(updatedAnswers)
      }
    } catch (error) {
      console.error("[v0] Failed to evaluate answer:", error)
      toast.error("Failed to evaluate answer, but continuing interview.")
      
      // Continue without evaluation
      const newAnswer = {
        question: questions[currentQuestionIndex],
        answer: answer.trim(),
        timeSpent: 0,
        score: 7, // Default score
        feedback: "Answer recorded successfully.",
        strengths: ["Answer provided"],
        improvements: ["Consider adding more specific examples"],
        timestamp: new Date()
      }

      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)
      setAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        await handleCompleteInterview(updatedAnswers)
      }
    } finally {
      setEvaluatingAnswer(false)
    }
  }

  // <CHANGE> Enhanced interview completion with comprehensive AI feedback
  const handleCompleteInterview = async (finalAnswers = answers) => {
    try {
      console.log("[v0] Completing interview with answers:", finalAnswers)

      const averageScore = finalAnswers.length > 0 
        ? finalAnswers.reduce((sum, a) => sum + (a.score || 7), 0) / finalAnswers.length 
        : 7

      // Generate comprehensive feedback using AI
      const feedbackResponse = await axios.post("/api/questions/feedback", {
        questions: finalAnswers.map((a) => a.question),
        answers: finalAnswers.map((a) => a.answer),
        role: config.role,
        experience: config.experience,
        overallScore: averageScore,
        individualScores: finalAnswers.map(a => a.score || 7)
      })

      console.log("[v0] Comprehensive feedback received:", feedbackResponse.data)

      const comprehensiveFeedback = feedbackResponse.data

      const interviewData = {
        questions: finalAnswers,
        status: "completed",
        completedAt: new Date(),
        overallScore: averageScore,
        feedback: comprehensiveFeedback,
        timeSpent: config.duration * 60 - timeRemaining,
        config: config
      }

      // Update interview record
      if (interviewId) {
        await axios.put(`/api/interviews/${interviewId}`, interviewData)
        console.log("[v0] Interview record updated successfully")
      }

      toast.success("Interview completed successfully!")
      
      onComplete({
        ...config,
        ...interviewData,
      })
    } catch (error) {
      console.error("[v0] Failed to complete interview:", error)
      toast.error("Failed to save interview results, but your answers were recorded.")
      
      // Still complete the interview with basic data
      onComplete({
        ...config,
        questions: finalAnswers,
        status: "completed",
        overallScore: finalAnswers.length > 0 
          ? finalAnswers.reduce((sum, a) => sum + (a.score || 7), 0) / finalAnswers.length 
          : 7,
        timeSpent: config.duration * 60 - timeRemaining,
      })
    }
  }

  // ... existing code ...

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generating Your Personalized Interview</h3>
          <p className="text-gray-600 mb-2">
            Our AI is creating unique questions tailored for your {config.role} interview...
          </p>
          <div className="text-sm text-gray-500">
            <p>Experience Level: {config.experience}</p>
            <p>Difficulty: {config.difficulty}</p>
            <p>Duration: {config.duration} minutes</p>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Unable to Generate Questions</h3>
          <p className="text-gray-600 mb-4">
            {questionGenerationError 
              ? "AI question generation failed. Please check your internet connection and try again."
              : "No questions were generated. Please try again."
            }
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
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
                    Evaluating with AI...
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
