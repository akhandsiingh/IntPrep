"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle, AlertCircle, XCircle, Trophy, Target, Clock } from "lucide-react"

interface SessionAnalysisProps {
  transcript: string
  questions: string[]
  answers: string[]
  interviewData?: any
}

export function SessionAnalysis({ transcript, questions, answers, interviewData }: SessionAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [interviewScore, setInterviewScore] = useState<number | null>(null)

  const analyzeSession = async () => {
    if (!transcript || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, questions, answers, interviewData }),
      })

      const data = await response.json()
      if (data.analysis) {
        setAnalysis(data.analysis)
        if (data.score) {
          setInterviewScore(data.score)
        }
      }
    } catch (error) {
      console.error("Error analyzing session:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const parseAnalysis = (analysisText: string) => {
    const sections = analysisText.split(/(?=STRENGTHS:|AREAS FOR IMPROVEMENT:|ERRORS\/ISSUES:|INTERVIEW SCORE:)/)
    const parsed = {
      strengths: "",
      improvements: "",
      errors: "",
      score: "",
    }

    sections.forEach((section) => {
      if (section.match(/^STRENGTHS:/)) {
        parsed.strengths = section.replace(/^STRENGTHS:/, "").trim()
      } else if (section.match(/^AREAS FOR IMPROVEMENT:/)) {
        parsed.improvements = section.replace(/^AREAS FOR IMPROVEMENT:/, "").trim()
      } else if (section.match(/^ERRORS\/ISSUES:/)) {
        parsed.errors = section.replace(/^ERRORS\/ISSUES:/, "").trim()
      } else if (section.match(/^INTERVIEW SCORE:/)) {
        parsed.score = section.replace(/^INTERVIEW SCORE:/, "").trim()
      }
    })

    return parsed
  }

  const analysisData = analysis ? parseAnalysis(analysis) : null

  const getBasicMetrics = () => {
    if (!transcript) return null

    const wordCount = transcript.split(" ").length
    const avgWordsPerMinute = Math.round(wordCount / 2) // Assuming 2 minute response
    const responseLength = transcript.length

    return {
      wordCount,
      avgWordsPerMinute,
      responseLength,
      clarity: responseLength > 100 ? "Good" : "Needs improvement",
    }
  }

  const metrics = getBasicMetrics()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Interview Analysis
          {isAnalyzing && (
            <Badge variant="secondary" className="animate-pulse">
              Analyzing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviewData && (
          <div className="bg-accent/10 p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Interview Context:</p>
            <p className="text-sm font-medium">
              {interviewData.position} • {interviewData.experience} experience
            </p>
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Word Count</span>
              </div>
              <p className="text-lg font-semibold">{metrics.wordCount}</p>
            </div>
            <div className="bg-primary/5 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Clarity</span>
              </div>
              <p className="text-lg font-semibold">{metrics.clarity}</p>
            </div>
          </div>
        )}

        {!transcript && (
          <p className="text-muted-foreground text-center py-8">
            Complete your interview responses to get detailed feedback...
          </p>
        )}

        {transcript && !analysis && (
          <div className="text-center py-4">
            <Button onClick={analyzeSession} disabled={isAnalyzing}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing Interview..." : "Get Interview Feedback"}
            </Button>
          </div>
        )}

        {analysisData && (
          <div className="space-y-4">
            {interviewScore && (
              <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h4 className="font-medium text-primary">Interview Performance</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Score</span>
                    <span className="font-medium">{interviewScore}/100</span>
                  </div>
                  <Progress value={interviewScore} className="h-2" />
                </div>
              </div>
            )}

            {analysisData.strengths && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-700">Strengths</h4>
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.strengths}</p>
              </div>
            )}

            {analysisData.improvements && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-medium text-yellow-700">Areas for Improvement</h4>
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.improvements}</p>
              </div>
            )}

            {analysisData.errors && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-red-700">Issues to Address</h4>
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.errors}</p>
              </div>
            )}

            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Interview Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                <li>Provide specific examples from your experience</li>
                <li>Ask thoughtful questions about the role and company</li>
                <li>Practice your responses to common questions</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
