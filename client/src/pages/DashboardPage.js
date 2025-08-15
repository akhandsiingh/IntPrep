"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { BarChart3, Clock, Target, TrendingUp, Play, ArrowLeft } from "lucide-react"
import axios from "axios"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/users/stats")
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Track your interview practice progress</p>
            </div>
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              New Interview
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalInterviews || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.completedInterviews || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.averageScore ? `${stats.averageScore.toFixed(1)}/10` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Practiced</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalTimeSpent ? `${Math.floor(stats.totalTimeSpent / 60)}h` : "0h"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Interviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Interviews</h2>
            {stats?.recentInterviews?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentInterviews.map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.role}</h3>
                      <p className="text-sm text-gray-600">
                        {interview.experience} • {interview.difficulty} • {interview.duration} minutes
                      </p>
                      <p className="text-xs text-gray-500">{new Date(interview.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          interview.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : interview.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {interview.status}
                      </div>
                      {interview.overallScore && (
                        <p className="text-sm font-semibold text-gray-900 mt-1">Score: {interview.overallScore}/10</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No interviews yet</p>
                <button
                  onClick={() => navigate("/interview")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Your First Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
