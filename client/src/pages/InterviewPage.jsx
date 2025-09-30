"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import InterviewStarter from "../components/InterviewStarter"
import InterviewChat from "../components/InterviewChat"
import { Sparkles, History, LogOut } from "lucide-react"

const InterviewPage = () => {
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  const [firstQuestion, setFirstQuestion] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  const handleInterviewStart = (data, question) => {
    setInterviewData(data)
    setFirstQuestion(question)
    setInterviewStarted(true)
    setShowHistory(false)
  }

  const handleInterviewEnd = () => {
    setInterviewStarted(false)
    setInterviewData(null)
    setFirstQuestion("")
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">IntPrep</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  History
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          {showHistory ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Interview History</h2>
              <div className="border border-border rounded-xl bg-card p-12 text-center">
                <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">No interview history yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete your first interview to see your progress and analytics here
                </p>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start Your First Interview
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Ready to Practice?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Set up your interview session and start practicing with our AI interviewer. Get personalized questions
                  and instant feedback.
                </p>
              </div>

              <InterviewStarter onInterviewStart={handleInterviewStart} />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">IntPrep</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <InterviewChat
          interviewData={interviewData}
          firstQuestion={firstQuestion}
          onInterviewEnd={handleInterviewEnd}
        />
      </div>
    </div>
  )
}

export default InterviewPage
