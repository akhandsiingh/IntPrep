"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MessageSquare, RotateCcw, Trophy } from "lucide-react"
import type { InterviewConfig, InterviewAnswer } from "@/app/interview/page"

interface InterviewResultsProps {
  config: InterviewConfig
  answers: InterviewAnswer[]
  onRestart: () => void
}

export function InterviewResults({ config, answers, onRestart }: InterviewResultsProps) {
  const completionRate = (answers.length / 5) * 100 // Assuming 5 questions
  const averageAnswerLength = answers.reduce((acc, answer) => acc + answer.answer.length, 0) / answers.length

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed in your {config.role} interview</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(completionRate)}`}>{completionRate.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground">Questions answered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <CardTitle>Response Quality</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">{averageAnswerLength.toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">Avg. characters per answer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <CardTitle>Duration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">{config.duration}</div>
              <p className="text-sm text-muted-foreground">Minutes allocated</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
            <CardDescription>Based on your responses and interview configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Overall Score</span>
              <Badge variant={completionRate >= 80 ? "default" : completionRate >= 60 ? "secondary" : "destructive"}>
                {getScoreBadge(completionRate)}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-semibold">{answers.length} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>Interview Type:</span>
                <span className="font-semibold">{config.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty Level:</span>
                <span className="font-semibold capitalize">{config.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience Level:</span>
                <span className="font-semibold capitalize">{config.experience}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Responses</CardTitle>
            <CardDescription>Review your answers to improve for next time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {answers.map((answer, index) => (
              <div key={answer.questionId} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold mb-2">Question {index + 1}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {answer.answer.length > 100 ? `${answer.answer.substring(0, 100)}...` : answer.answer}
                </p>
                <span className="text-xs text-muted-foreground">
                  {answer.answer.length} characters • {answer.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={onRestart} size="lg" className="mr-4">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
          <Button variant="outline" size="lg" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
