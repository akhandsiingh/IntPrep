"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Sparkles, Target, TrendingUp } from "lucide-react"

const HomePage = () => {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">IntPrep</span>
            </div>
            <nav className="flex items-center gap-4">
              {currentUser ? (
                <Link
                  to="/interview"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Master Your <span className="text-gradient">Interview Skills</span> with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Practice interviews with our AI-powered platform. Get real-time feedback, track your progress, and land your
            dream job with confidence.
          </p>

          <div className="flex gap-4 justify-center">
            {currentUser ? (
              <Link
                to="/interview"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Start Practicing
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-8 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Questions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get intelligent, context-aware questions that adapt to your responses and experience level.
            </p>
          </div>
          <div className="p-8 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Feedback</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive instant, actionable feedback on your answers to improve your interview performance.
            </p>
          </div>
          <div className="p-8 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor your improvement over time with detailed analytics and performance insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
