"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, User, Clock, BookOpen } from "lucide-react"

interface InterviewStarterProps {
  onInterviewStart: (data: any, firstQuestion: string) => void
}

export function InterviewStarter({ onInterviewStart }: InterviewStarterProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const questions = interviewQuestions[formData.interviewType as keyof typeof interviewQuestions]
    const firstQuestion = questions[0]
    onInterviewStart(formData, firstQuestion)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Interview Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Position Applying For
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Software Engineer, Product Manager"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Years of Experience
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                  <SelectItem value="2-5">2-5 years (Mid Level)</SelectItem>
                  <SelectItem value="6-10">6-10 years (Senior Level)</SelectItem>
                  <SelectItem value="10+">10+ years (Expert Level)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Brief Background
              </Label>
              <Textarea
                id="background"
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                placeholder="Tell us about your educational background, key skills, or relevant experience..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, interviewType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Interview</SelectItem>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Interview Practice
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
