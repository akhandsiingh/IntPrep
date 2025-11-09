"use client"

import { useState, useRef, useEffect } from "react"

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const restartTimeoutRef = useRef(null) // Add timeout ref to handle auto-restart

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true // Set to true to keep recording
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        finalTranscriptRef.current = ""
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
      }

      recognitionRef.current.onend = () => {
        if (recognitionRef.current && isListening) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.log(" Recognition already started")
            }
          }, 100)
        } else {
          setIsListening(false)
        }
      }

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript

          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + " "
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscriptRef.current + interimTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error(" Speech recognition error:", event.error)
        if (event.error !== "no-speech") {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      finalTranscriptRef.current = ""
      setTranscript("")
      setIsListening(true) // Set to true before starting
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false) // Set to false to prevent auto-restart
      recognitionRef.current.stop()
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }

  const resetTranscript = () => {
    setTranscript("")
    finalTranscriptRef.current = ""
  }

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  }
}
