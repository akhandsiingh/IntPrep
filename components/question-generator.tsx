"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageSquare, ArrowRight, AlertCircle } from "lucide-react"

interface QuestionGeneratorProps {
  transcript: string
  onQuestionGenerated: (questions: string[]) => void
  interviewData: any
  currentQuestion: string
  onQuestionChange: (question: string) => void
}

export function QuestionGenerator({
  transcript,
  onQuestionGenerated,
  interviewData,
  currentQuestion,
  onQuestionChange,
}: QuestionGeneratorProps) {
  const [questions, setQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [isAnswering, setIsAnswering] = useState<{ [key: string]: boolean }>({})
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [apiNote, setApiNote] = useState<string>("") // Added API note state

  useEffect(() => {
    if (transcript && transcript.length > 30) {
      generateFollowUpQuestions()
    }
  }, [transcript])

  const generateFollowUpQuestions = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setApiNote("") // Clear previous API note

    try {
      console.log("[v0] Generating follow-up questions for transcript:", transcript.substring(0, 50) + "...")

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          interviewData,
          currentQuestion,
          context: "interview",
        }),
      })

      const data = await response.json()
      if (data.questions) {
        setFollowUpQuestions(data.questions)
        onQuestionGenerated(data.questions)
        console.log("[v0] Generated questions:", data.questions)

        if (data.note) {
          setApiNote(data.note)
        }
      }
    } catch (error) {
      console.error("Error generating questions:", error)
      setApiNote(
        "Unable to generate AI questions. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const answerQuestion = async (question: string) => {
    setIsAnswering((prev) => ({ ...prev, [question]: true }))

    try {
      const response = await fetch("/api/answer-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: transcript,
          interviewData,
        }),
      })

      const data = await response.json()
      if (data.answer) {
        setAnswers((prev) => ({ ...prev, [question]: data.answer }))
      }
    } catch (error) {
      console.error("Error answering question:", error)
    } finally {
      setIsAnswering((prev) => ({ ...prev, [question]: false }))
    }
  }

  // Added function to move to next question
  const moveToNextQuestion = (question: string) => {
    onQuestionChange(question)
    console.log("[v0] Moving to question:", question)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Current Interview Question
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show current interview question */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-5 w-5 mt-1 text-primary" />
            <div>
              <p className="font-medium text-primary mb-2">Current Question:</p>
              <p className="text-sm">{currentQuestion}</p>
            </div>
          </div>
        </div>

        {transcript && (
          <div className="bg-accent/10 p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Your Response:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {apiNote && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
              <p className="text-sm text-yellow-800">{apiNote}</p>
            </div>
          </div>
        )}

        {/* Show follow-up questions based on response */}
        {followUpQuestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Follow-up Questions</Badge>
              {isGenerating && (
                <Badge variant="outline" className="animate-pulse">
                  Generating
                </Badge>
              )}
            </div>

            {followUpQuestions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm">{question}</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => moveToNextQuestion(question)} variant="outline" size="sm">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Ask This Next
                  </Button>

                  <Button
                    onClick={() => answerQuestion(question)}
                    variant="ghost"
                    size="sm"
                    disabled={isAnswering[question]}
                  >
                    {isAnswering[question] ? "Getting Answer..." : "Get Sample Answer"}
                  </Button>
                </div>

                {answers[question] && (
                  <div className="bg-accent/10 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Sample Answer:</p>
                    <p className="text-sm text-accent-foreground">{answers[question]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!transcript && (
          <p className="text-muted-foreground text-center py-4">
            Start speaking to answer the current question and generate follow-ups...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
