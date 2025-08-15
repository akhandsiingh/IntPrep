"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Play } from "lucide-react"

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer",
]

const experienceLevels = ["Entry-level", "Mid-level", "Senior", "Lead", "Executive"]

const difficulties = ["Easy", "Medium", "Hard"]

const durations = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
]

export default function InterviewSetup({ onStart }) {
  const navigate = useNavigate()
  const [config, setConfig] = useState({
    role: "Software Engineer",
    experience: "Mid-level",
    difficulty: "Medium",
    duration: 30,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onStart(config)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Mock Interview</h1>
            <p className="text-gray-600">Configure your interview preferences to get personalized questions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
              <select
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConfig({ ...config, experience: level })}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      config.experience === level
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setConfig({ ...config, difficulty })}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      config.difficulty === difficulty
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Duration</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => setConfig({ ...config, duration: duration.value })}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      config.duration === duration.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Interview Preview</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <span className="font-medium">Role:</span> {config.role}
                </p>
                <p>
                  <span className="font-medium">Experience:</span> {config.experience}
                </p>
                <p>
                  <span className="font-medium">Difficulty:</span> {config.difficulty}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {config.duration} minutes
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Interview
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
