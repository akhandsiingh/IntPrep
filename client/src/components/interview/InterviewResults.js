"use client"

import { useNavigate } from "react-router-dom"
import { Trophy, Clock, Target, RotateCcw, Home, BarChart3, Sparkles, TrendingUp, AlertCircle } from "lucide-react"

export default function InterviewResults({ data, onRestart }) {
  const navigate = useNavigate()

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score) => {
    if (score >= 8) return "bg-green-100"
    if (score >= 6) return "bg-yellow-100"
    return "bg-red-100"
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Here's your AI-powered performance analysis</p>
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${getScoreBg(data.overallScore)} ${getScoreColor(data.overallScore)}`}
              >
                {data.overallScore}/10
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overall Performance</h2>
              <p className="text-gray-600">
                {data.overallScore >= 8
                  ? "Excellent performance! You're well-prepared for interviews."
                  : data.overallScore >= 6
                    ? "Good job! With some practice, you'll be ready for any interview."
                    : "Keep practicing! Focus on the areas highlighted below."}
              </p>
            </div>
          </div>

          {data.feedback && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Feedback</h3>
              </div>

              <div className="space-y-6">
                {/* Overall Feedback */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{data.feedback.overallFeedback}</p>
                </div>

                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Key Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {data.feedback.keyStrengths?.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-2">
                    {data.feedback.areasForImprovement?.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-orange-700">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {data.feedback.recommendations?.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-700">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions Answered</p>
                  <p className="text-xl font-semibold text-gray-900">{data.questions?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-xl font-semibold text-gray-900">{formatTime(data.timeSpent || 0)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Interview Type</p>
                  <p className="text-xl font-semibold text-gray-900">{data.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Question Analysis</h3>
            <div className="space-y-6">
              {data.questions?.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      Q{index + 1}: {item.question}
                    </p>
                    {item.score && (
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          item.score >= 8
                            ? "bg-green-100 text-green-800"
                            : item.score >= 6
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.score}/10
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-gray-700 text-sm">{item.answer || "No answer provided"}</p>
                  </div>
                  {item.feedback && (
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600 italic">{item.feedback}</p>
                      {item.strengths && item.strengths.length > 0 && (
                        <div>
                          <span className="text-green-600 font-medium">Strengths: </span>
                          <span className="text-green-700">{item.strengths.join(", ")}</span>
                        </div>
                      )}
                      {item.improvements && item.improvements.length > 0 && (
                        <div>
                          <span className="text-orange-600 font-medium">Improvements: </span>
                          <span className="text-orange-700">{item.improvements.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              View Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium py-3 px-6 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
