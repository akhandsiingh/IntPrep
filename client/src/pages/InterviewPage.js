"use client"

import { useState } from "react"
import InterviewSetup from "../components/interview/InterviewSetup"
import InterviewSession from "../components/interview/InterviewSession"
import InterviewResults from "../components/interview/InterviewResults"

export default function InterviewPage() {
  const [currentStep, setCurrentStep] = useState("setup") // setup, session, results
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [interviewData, setInterviewData] = useState(null)

  const handleStartInterview = (config) => {
    setInterviewConfig(config)
    setCurrentStep("session")
  }

  const handleCompleteInterview = (data) => {
    setInterviewData(data)
    setCurrentStep("results")
  }

  const handleRestartInterview = () => {
    setCurrentStep("setup")
    setInterviewConfig(null)
    setInterviewData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "setup" && <InterviewSetup onStart={handleStartInterview} />}
      {currentStep === "session" && <InterviewSession config={interviewConfig} onComplete={handleCompleteInterview} />}
      {currentStep === "results" && <InterviewResults data={interviewData} onRestart={handleRestartInterview} />}
    </div>
  )
}
