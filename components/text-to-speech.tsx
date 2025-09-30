"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause, Play } from "lucide-react"

interface TextToSpeechProps {
  text: string
  autoSpeak?: boolean
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
}

export function TextToSpeech({ text, autoSpeak = false, onSpeechStart, onSpeechEnd }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis
      const newUtterance = new SpeechSynthesisUtterance(text)

      // Configure voice settings
      newUtterance.rate = 0.9
      newUtterance.pitch = 1
      newUtterance.volume = 0.8

      // Try to use a female voice for more natural interview feel
      const voices = synth.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen"),
      )
      if (femaleVoice) {
        newUtterance.voice = femaleVoice
      }

      newUtterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        onSpeechStart?.()
        console.log("[v0] Started speaking:", text.substring(0, 50) + "...")
      }

      newUtterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        onSpeechEnd?.()
        console.log("[v0] Finished speaking")
      }

      newUtterance.onerror = (event) => {
        console.error("[v0] Speech synthesis error:", event.error)
        setIsSpeaking(false)
        setIsPaused(false)
      }

      setUtterance(newUtterance)

      // Auto-speak if enabled
      if (autoSpeak && isEnabled && text.trim()) {
        setTimeout(() => {
          synth.speak(newUtterance)
        }, 500) // Small delay to ensure UI is ready
      }
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text, autoSpeak, isEnabled])

  const handleSpeak = () => {
    if (!utterance || typeof window === "undefined") return

    const synth = window.speechSynthesis

    if (isSpeaking && !isPaused) {
      synth.pause()
      setIsPaused(true)
    } else if (isPaused) {
      synth.resume()
      setIsPaused(false)
    } else {
      synth.speak(utterance)
    }
  }

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled)
    if (isSpeaking) {
      handleStop()
    }
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null // Don't render on server or unsupported browsers
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleEnabled}
        className={isEnabled ? "text-primary" : "text-muted-foreground"}
      >
        {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      {isEnabled && (
        <>
          <Button variant="ghost" size="sm" onClick={handleSpeak} disabled={!text.trim()}>
            {isSpeaking && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {isSpeaking && (
            <Button variant="ghost" size="sm" onClick={handleStop}>
              Stop
            </Button>
          )}
        </>
      )}

      {isSpeaking && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Speaking...
        </div>
      )}
    </div>
  )
}
