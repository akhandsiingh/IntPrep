"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, CheckCircle, XCircle, TrendingUp, Target, Award } from "lucide-react"
import { submitAnswer, analyzeSession } from "../services/api"

const InterviewChat = ({ interviewData, firstQuestion, onInterviewEnd }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: firstQuestion,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [error, setError] = useState(null) // Added error state for better error handling
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const conversationHistory = [...messages, userMessage]
      const currentQuestion = messages[messages.length - 1].content

      const response = await submitAnswer(inputValue.trim(), currentQuestion, conversationHistory, interviewData)

      if (response.nextQuestion) {
        const assistantMessage = {
          role: "assistant",
          content: response.nextQuestion,
          feedback: response.feedback,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }

      if (response.isComplete) {
        setIsComplete(true)
        const analysisResult = await analyzeSession(conversationHistory, interviewData)
        setAnalysis(analysisResult)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualEnd = async () => {
    console.log("[v0] Starting manual interview end")
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Conversation history:", messages)
      console.log("[v0] Interview data:", interviewData)

      const conversationHistory = messages
      const analysisResult = await analyzeSession(conversationHistory, interviewData)

      console.log("[v0] Analysis result received:", analysisResult)

      if (analysisResult && (analysisResult.analysis || analysisResult.score)) {
        setAnalysis(analysisResult)
        setIsComplete(true)
        setShowEndConfirm(false)
        console.log("[v0] Analysis set successfully")
      } else {
        throw new Error("Invalid analysis response")
      }
    } catch (error) {
      console.error("[v0] Error analyzing session:", error)
      setError("Failed to analyze interview. Please try again.")

      // Fallback: Show basic completion without detailed analysis
      setAnalysis({
        analysis:
          "Interview completed. Unable to generate detailed analysis at this time. Please try starting a new interview.",
        score: null,
      })
      setIsComplete(true)
      setShowEndConfirm(false)
    } finally {
      setIsLoading(false)
      console.log("[v0] Manual end process completed")
    }
  }

  const handleNewInterview = () => {
    onInterviewEnd()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{interviewData.position}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Candidate: {interviewData.name}</span>
              <span>•</span>
              <span>Experience: {interviewData.experience}</span>
              <span>•</span>
              <span>Type: {interviewData.interviewType}</span>
            </div>
          </div>
          {!isComplete && (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="px-5 py-2.5 bg-red-500/20 border-2 border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 hover:border-red-500 transition-all text-sm font-medium flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <XCircle className="h-4 w-4" />
              End Interview
            </button>
          )}
        </div>
      </div>

      {showEndConfirm && (
        <div className="mb-6 border-2 border-red-500/50 bg-red-500/10 rounded-xl p-6 shadow-lg shadow-red-500/20">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-400">
            <XCircle className="h-5 w-5" />
            End Interview Early?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to end this interview? You'll receive analytics based on your current progress.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleManualEnd}
              disabled={isLoading}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Yes, End Interview"
              )}
            </button>
            <button
              onClick={() => {
                setShowEndConfirm(false)
                setError(null)
              }}
              disabled={isLoading}
              className="px-5 py-2.5 bg-muted border-2 border-border rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 font-medium"
            >
              Continue Interview
            </button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-xl bg-card shadow-lg overflow-hidden">
        <div className="h-[550px] overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl p-5 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white"
                    : "bg-muted border border-border"
                }`}
              >
                <p className="text-xs font-semibold mb-2 opacity-70">
                  {message.role === "user" ? "You" : "AI Interviewer"}
                </p>
                <p className="leading-relaxed">{message.content}</p>
                {message.feedback && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold mb-1 opacity-70">Feedback</p>
                    <p className="text-sm leading-relaxed opacity-90">{message.feedback}</p>
                  </div>
                )}
                <p className="text-xs opacity-50 mt-3">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border rounded-xl p-5 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm">AI is analyzing your response...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!isComplete ? (
          <form onSubmit={handleSubmit} className="border-t border-border p-6 bg-muted/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                Send
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-border p-6 bg-gradient-to-r from-success/10 to-success/5">
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle className="h-6 w-6" />
              <p className="font-semibold text-lg">Interview Complete!</p>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <div className="mt-8 border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b border-border">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Award className="h-7 w-7 text-primary" />
              Interview Performance Analysis
            </h3>
          </div>

          <div className="p-6">
            {analysis.score && (
              <div className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                    <p className="text-5xl font-bold text-gradient">{analysis.score}/100</p>
                  </div>
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-foreground">{analysis.analysis}</div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleNewInterview}
                className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
              >
                <Target className="h-5 w-5" />
                Start New Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewChat
