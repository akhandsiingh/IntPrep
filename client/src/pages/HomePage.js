"use client"

import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Brain, MessageSquare, Target, Users, LogOut } from "lucide-react"

export default function HomePage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.displayName || "User"}!</h1>
            <p className="text-gray-600">Ready to practice your interview skills?</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Mock Interviewer</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with AI-generated questions tailored to your field
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Smart questions generated using advanced AI technology</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Interactive</h3>
              <p className="text-gray-600 text-sm">Real-time conversation with instant feedback</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Targeted</h3>
              <p className="text-gray-600 text-sm">Questions customized for your specific role and industry</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Professional</h3>
              <p className="text-gray-600 text-sm">Practice like you're in a real interview scenario</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => navigate("/interview")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Start Mock Interview
          </button>
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
