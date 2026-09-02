import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'
import VoiceToggle from '@/pages/interview/components/VoiceToggle'
import { useSpeechRecognition } from '@/shared/hooks/useSpeechRecognition'

interface ChatPanelProps {
  onSubmitAnswer: (answer: string) => void
  isSubmitting: boolean
  isSpeaking: boolean
}

export default function ChatPanel({ onSubmitAnswer, isSubmitting, isSpeaking }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const { messages, voiceMode } = useInterviewStore()
  const { transcript, isListening, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(input)

  useEffect(() => {
    inputRef.current = input
  }, [input])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Sync voice transcript to input field
  useEffect(() => {
    if (voiceMode && transcript) {
      setInput(transcript)
    }
  }, [transcript, voiceMode])

  // Auto-start/stop when voice mode is toggled
  useEffect(() => {
    if (voiceMode) {
      startListening(inputRef.current)
    } else {
      stopListening()
    }
  }, [voiceMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stop mic when the interview page unmounts (closed or navigated away)
  useEffect(() => {
    return () => stopListening()
  }, [stopListening])

  // Pause mic while TTS is speaking to prevent picking up interviewer audio
  useEffect(() => {
    if (!voiceMode) return
    if (isSpeaking) {
      stopListening()
    } else {
      startListening(inputRef.current)
    }
  }, [isSpeaking]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    const answer = input.trim()
    if (!answer) return
    onSubmitAnswer(answer)
    setInput('')
    resetTranscript()
    if (voiceMode) {
      startListening('') // restart fresh for the next answer
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-violet-700">Your Answers</h2>
        <VoiceToggle
          isListening={isListening}
          onStart={() => startListening(inputRef.current)}
          onStop={stopListening}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              msg.role === 'interviewer'
                ? 'bg-white border border-violet-100 text-foreground'
                : 'bg-violet-600 text-white ml-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => {
            const val = e.target.value
            setInput(val)
            if (voiceMode && isListening) startListening(val)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer... (Shift+Enter for new line)"
          rows={2}
          className="flex-1 resize-none focus-visible:ring-violet-500"
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isSubmitting}
          className="self-end bg-violet-600 hover:bg-violet-700"
        >
          {isSubmitting ? '...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
