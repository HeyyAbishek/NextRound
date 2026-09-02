import { useState, useCallback, useRef } from 'react'

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface UseSpeechRecognitionReturn {
  transcript: string
  isListening: boolean
  startListening: (existingText?: string) => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldListenRef = useRef(false)
  const accumulatedRef = useRef('')
  const sessionIdRef = useRef(0)

  const startSession = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const myId = ++sessionIdRef.current
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let lastText = ''

    recognition.onresult = (event) => {
      if (myId !== sessionIdRef.current) return
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      lastText = text
      setTranscript(accumulatedRef.current + text)
    }

    recognition.onerror = (event) => {
      if (myId !== sessionIdRef.current) return
      // not-allowed means mic permission denied — stop trying
      if (event.error === 'not-allowed') {
        shouldListenRef.current = false
        setIsListening(false)
      }
      // all other errors (no-speech, network, aborted) let onend handle the restart
    }

    recognition.onend = () => {
      if (myId !== sessionIdRef.current) return
      if (shouldListenRef.current) {
        accumulatedRef.current += lastText
        // Small delay avoids InvalidStateError when the browser hasn't fully
        // torn down the previous session before we start a new one
        setTimeout(() => {
          if (shouldListenRef.current && myId === sessionIdRef.current) {
            startSession()
          }
        }, 150)
      } else {
        setIsListening(false)
      }
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch {
      // start() can throw if called while the previous session is still closing;
      // retry after a longer delay
      setTimeout(() => {
        if (shouldListenRef.current && myId === sessionIdRef.current) {
          startSession()
        }
      }, 300)
    }
  }, [])

  const startListening = useCallback((existingText = '') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    shouldListenRef.current = false
    recognitionRef.current?.abort()

    shouldListenRef.current = true
    accumulatedRef.current = existingText ? existingText.trimEnd() + ' ' : ''
    startSession()
    setIsListening(true)
  }, [startSession])

  const stopListening = useCallback(() => {
    shouldListenRef.current = false
    recognitionRef.current?.abort()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    accumulatedRef.current = ''
    setTranscript('')
  }, [])

  return { transcript, isListening, startListening, stopListening, resetTranscript }
}
