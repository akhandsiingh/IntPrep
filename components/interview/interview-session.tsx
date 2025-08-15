"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Clock, MessageSquare, SkipForward, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InterviewConfig, InterviewQuestion, InterviewAnswer } from "@/app/interview/page"

interface InterviewSessionProps {
  config: InterviewConfig
  onComplete: (answers: InterviewAnswer[]) => void
  questions: InterviewQuestion[]
  setQuestions: (questions: InterviewQuestion[]) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
}

export function InterviewSession({
  config,
  onComplete,
  questions,
  setQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: InterviewSessionProps) {
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [answers, setAnswers] = useState<InterviewAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/generate-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: config.role,
            experience: config.experience,
            difficulty: config.difficulty,
            duration: config.duration,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate questions")
        }

        const data = await response.json()
        setQuestions(data.questions)
      } catch (err) {
        console.error("Error generating questions:", err)
        setError("Failed to generate interview questions. Please try again.")
        toast({
          title: "Error",
          description: "Failed to generate questions. Using fallback questions.",
          variant: "destructive",
        })

        const fallbackQuestions: InterviewQuestion[] = [
          {
            id: "1",
            question: `Tell me about yourself and why you're interested in the ${config.role} position.`,
            category: "General",
            difficulty: config.difficulty,
          },
          {
            id: "2",
            question: `What experience do you have that makes you suitable for this ${config.role} role?`,
            category: "Experience",
            difficulty: config.difficulty,
          },
          {
            id: "3",
            question: "Describe a challenging project you worked on and how you overcame the obstacles.",
            category: "Problem Solving",
            difficulty: config.difficulty,
          },
        ]
        setQuestions(fallbackQuestions)
      } finally {
        setIsLoading(false)
      }
    }

    generateQuestions()
  }, [config, setQuestions, toast])

  useEffect(() => {
    if (timeRemaining > 0 && !isLoading && questions.length > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleCompleteInterview()
    }
  }, [timeRemaining, isLoading, questions.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      const newAnswer: InterviewAnswer = {
        questionId: questions[currentQuestionIndex].id,
        answer: currentAnswer,
        timestamp: new Date(),
      }
      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer("")
    } else {
      handleCompleteInterview()
    }
  }

  const handleCompleteInterview = () => {
    if (currentAnswer.trim() && questions[currentQuestionIndex]) {
      const finalAnswer: InterviewAnswer = {
        questionId: questions[currentQuestionIndex].id,
        answer: currentAnswer,
        timestamp: new Date(),
      }
      onComplete([...answers, finalAnswer])
    } else {
      onComplete(answers)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Generating Your Interview Questions</h3>
                <p className="text-muted-foreground mb-2">
                  Our AI is creating personalized questions for your {config.role} interview...
                </p>
                <p className="text-sm text-muted-foreground">
                  Experience: {config.experience} • Difficulty: {config.difficulty}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Generate Questions</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return null
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <div className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-2 py-1 rounded">
            AI Generated
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Interview Question</CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{currentQuestion?.category}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{currentQuestion?.question}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
            <CardDescription>Take your time to provide a thoughtful response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-32"
            />
            <div className="flex gap-3">
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Interview"}
              </Button>
              <Button variant="outline" onClick={handleNextQuestion}>
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
