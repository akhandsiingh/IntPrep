"use client"

import { useState } from "react"
import { Briefcase, User, Clock, BookOpen, Sparkles } from "lucide-react"

const InterviewStarter = ({ onInterviewStart }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    experience: "",
    background: "",
    interviewType: "general",
  })

  const interviewQuestions = {
    general: [
      "Tell me about yourself and your background.",
      "What interests you about this position?",
      "What are your greatest strengths?",
      "Describe a challenging situation you've faced and how you handled it.",
    ],
    technical: [
      "Walk me through your technical background and expertise.",
      "Describe a complex technical problem you've solved recently.",
      "How do you stay updated with the latest technologies?",
      "Explain a project you're particularly proud of.",
    ],
    behavioral: [
      "Tell me about a time when you had to work with a difficult team member.",
      "Describe a situation where you had to meet a tight deadline.",
      "How do you handle stress and pressure?",
      "Give me an example of when you showed leadership.",
    ],
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const questions = interviewQuestions[formData.interviewType]
    const firstQuestion = questions[0]
    onInterviewStart(formData, firstQuestion)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-lg">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            Interview Setup
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Fill in your details to start your personalized interview session
          </p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="block text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Position Applying For
                </label>
                <input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  required
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Years of Experience
              </label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
              >
                <option value="">Select your experience level</option>
                <option value="0-1">0-1 years (Entry Level)</option>
                <option value="2-5">2-5 years (Mid Level)</option>
                <option value="6-10">6-10 years (Senior Level)</option>
                <option value="10+">10+ years (Expert Level)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="background" className="block text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Brief Background
              </label>
              <textarea
                id="background"
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                placeholder="Tell us about your educational background, key skills, or relevant experience..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="interviewType" className="block text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Interview Type
              </label>
              <select
                id="interviewType"
                value={formData.interviewType}
                onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
              >
                <option value="general">General Interview</option>
                <option value="technical">Technical Interview</option>
                <option value="behavioral">Behavioral Interview</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Interview Practice
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InterviewStarter
