"use client"

import { useState, useRef } from "react"

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(typeof window !== "undefined" && "speechSynthesis" in window)
  const utteranceRef = useRef(null) // Track utterance to properly handle end event

  const speak = (text, options = {}) => {
    if (!isSupported || !text) return

    window.speechSynthesis.cancel()
    utteranceRef.current = null

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1
    utterance.lang = options.lang || "en-US"

    utterance.onstart = () => {
      console.log("TTS started")
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      console.log("TTS ended")
      setIsSpeaking(false)
      utteranceRef.current = null
    }

    utterance.onpause = () => {
      console.log("TTS paused")
    }

    utterance.onresume = () => {
      console.log("TTS resumed")
      setIsSpeaking(true)
    }

    utterance.onerror = (error) => {
      console.error(" Text-to-speech error:", error.error)
      setIsSpeaking(false)
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      console.log(" Stopping TTS")
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      utteranceRef.current = null
    }
  }

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  }
}
