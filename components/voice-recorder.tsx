"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, MessageCircle, ArrowRight, Volume2 } from "lucide-react"
import type SpeechRecognition from "speech-recognition"

interface VoiceRecorderProps {
  onTranscriptUpdate: (transcript: string) => void
  isProcessing: boolean
  currentQuestion?: string
  onResponseComplete?: () => void
  isSpeaking?: boolean
}

export function VoiceRecorder({
  onTranscriptUpdate,
  isProcessing,
  currentQuestion,
  onResponseComplete,
  isSpeaking = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
  const [hasSpoken, setHasSpoken] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isActiveRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart
              setHasSpoken(true)
            } else {
              interimTranscript += transcriptPart
            }
          }

          const fullTranscript = transcript + finalTranscript + interimTranscript
          setTranscript(fullTranscript)
          onTranscriptUpdate(fullTranscript)

          if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
          }

          if (finalTranscript.trim() && hasSpoken) {
            const timer = setTimeout(() => {
              console.log("[v0] Silence detected, stopping recording")
              stopRecording()
            }, 4000)
            setSilenceTimer(timer)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          if (event.error === "aborted") {
            console.log("[v0] Speech recognition was aborted")
            isActiveRef.current = false
            setIsRecording(false)
            setIsStarting(false)
            setIsStopping(false)
          } else if (event.error === "no-speech") {
            console.log("[v0] No speech detected, continuing to listen")
          } else {
            isActiveRef.current = false
            setIsRecording(false)
            setIsStarting(false)
            setIsStopping(false)
          }
        }

        recognition.onend = () => {
          console.log("[v0] Speech recognition ended")
          isActiveRef.current = false
          setIsRecording(false)
          setIsStarting(false)
          setIsStopping(false)
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
          }
        }

        recognition.onstart = () => {
          console.log("[v0] Speech recognition started successfully")
          isActiveRef.current = true
          setIsRecording(true)
          setIsStarting(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [transcript, onTranscriptUpdate, silenceTimer, hasSpoken])

  useEffect(() => {
    if (isSpeaking && isRecording && !isStopping) {
      console.log("[v0] AI is speaking, stopping voice recording")
      stopRecording()
    }
  }, [isSpeaking])

  const startRecording = () => {
    if (isSpeaking) {
      console.log("[v0] Cannot start recording while AI is speaking")
      return
    }

    if (isStarting || isStopping || isActiveRef.current) {
      console.log("[v0] Recognition is already starting, stopping, or active")
      return
    }

    if (recognitionRef.current && !isRecording) {
      setTranscript("")
      setHasSpoken(false)
      onTranscriptUpdate("")
      setIsStarting(true)

      setTimeout(() => {
        try {
          if (recognitionRef.current && !isActiveRef.current) {
            recognitionRef.current.start()
            console.log("[v0] Started recording")
          }
        } catch (error) {
          console.error("[v0] Error starting speech recognition:", error)
          setIsStarting(false)
          isActiveRef.current = false
        }
      }, 100)
    }
  }

  const stopRecording = () => {
    if (isStopping || !isActiveRef.current) {
      return
    }

    if (recognitionRef.current && isRecording) {
      setIsStopping(true)
      try {
        recognitionRef.current.stop()
        if (silenceTimer) {
          clearTimeout(silenceTimer)
          setSilenceTimer(null)
        }
        console.log("[v0] Stopped recording")
      } catch (error) {
        console.error("[v0] Error stopping speech recognition:", error)
        setIsStopping(false)
        isActiveRef.current = false
      }
    }
  }

  const clearTranscript = () => {
    setTranscript("")
    setHasSpoken(false)
    onTranscriptUpdate("")
  }

  const completeResponse = () => {
    if (transcript.trim() && onResponseComplete) {
      console.log("[v0] Response completed, moving to next question")
      onResponseComplete()
      clearTranscript()
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Response
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              Recording
            </Badge>
          )}
          {isProcessing && <Badge variant="secondary">Processing</Badge>}
          {isSpeaking && (
            <Badge variant="outline" className="animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              AI Speaking
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQuestion && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 mt-1 text-primary" />
              <div>
                <p className="text-xs text-primary font-medium mb-1">Answering:</p>
                <p className="text-sm">{currentQuestion}</p>
              </div>
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                AI is reading the question aloud. Please wait before recording your response.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="w-32"
            disabled={isProcessing || isSpeaking || isStarting || isStopping}
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                {isSpeaking ? "Wait..." : isStarting ? "Starting..." : "Start"}
              </>
            )}
          </Button>
          <Button onClick={clearTranscript} variant="outline" disabled={isRecording || isProcessing || isSpeaking}>
            Clear
          </Button>
          {transcript.trim() && !isRecording && (
            <Button onClick={completeResponse} variant="default" size="lg" disabled={isSpeaking}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Next Question
            </Button>
          )}
        </div>

        {transcript && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Your Response:</h4>
            <p className="text-sm leading-relaxed">{transcript}</p>
            {!isRecording && transcript.trim() && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  ✅ Response recorded. Click "Next Question" to continue the interview.
                </p>
              </div>
            )}
          </div>
        )}

        {!transcript && !isRecording && !isSpeaking && (
          <div className="text-center py-4 space-y-2">
            <p className="text-muted-foreground text-sm">Click "Start" to begin recording your answer</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 Tips: Speak clearly and take your time</p>
              <p>📝 Structure your answer with examples</p>
              <p>⏱️ Recording will auto-stop after 4 seconds of silence</p>
            </div>
          </div>
        )}

        {!transcript && !isRecording && isSpeaking && (
          <div className="text-center py-4 space-y-2">
            <p className="text-muted-foreground text-sm">
              🎤 Listen to the question, then click "Start" to record your answer
            </p>
            <div className="text-xs text-muted-foreground">
              <p>The AI will finish speaking shortly...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
