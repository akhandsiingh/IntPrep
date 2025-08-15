"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import type { InterviewConfig } from "@/app/interview/page"

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const router = useRouter()
  const [role, setRole] = useState("")
  const [customRole, setCustomRole] = useState("")
  const [experience, setExperience] = useState("")
  const [duration, setDuration] = useState("15")
  const [difficulty, setDifficulty] = useState("")

  const predefinedRoles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "Marketing Manager",
    "Sales Representative",
    "Business Analyst",
    "Project Manager",
    "Custom",
  ]

  const handleStart = () => {
    const finalRole = role === "Custom" ? customRole : role
    if (!finalRole || !experience || !difficulty) return

    onStart({
      role: finalRole,
      experience,
      duration: Number.parseInt(duration),
      difficulty,
    })
  }

  const isValid = (role === "Custom" ? customRole : role) && experience && difficulty

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Setup Your Mock Interview</CardTitle>
            <CardDescription>Configure your interview preferences to get personalized questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Job Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {role === "Custom" && (
                <Input
                  placeholder="Enter your custom role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Interview Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Basic questions</SelectItem>
                  <SelectItem value="medium">Medium - Standard interview questions</SelectItem>
                  <SelectItem value="hard">Hard - Challenging technical questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Interview Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleStart} disabled={!isValid} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
