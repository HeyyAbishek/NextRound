import { create } from 'zustand'
import type { InterviewQuestion, AnswerEvaluation } from '@/types/interview.types'

interface InterviewState {
  isActive: boolean
  sessionId: string | null
  currentQuestion: InterviewQuestion | null
  messages: { role: 'interviewer' | 'user'; content: string }[]
  evaluations: AnswerEvaluation[]
  voiceMode: boolean
  setActive: (active: boolean) => void
  setSessionId: (id: string) => void
  setCurrentQuestion: (question: InterviewQuestion | null) => void
  addMessage: (message: { role: 'interviewer' | 'user'; content: string }) => void
  addEvaluation: (evaluation: AnswerEvaluation) => void
  toggleVoiceMode: () => void
  resume: (sessionId: string) => void
  reset: () => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  isActive: false,
  sessionId: null,
  currentQuestion: null,
  messages: [],
  evaluations: [],
  voiceMode: true,
  setActive: (active) => set({ isActive: active }),
  setSessionId: (id) => set({ sessionId: id }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addEvaluation: (evaluation) => set((state) => ({ evaluations: [...state.evaluations, evaluation] })),
  toggleVoiceMode: () => set((state) => ({ voiceMode: !state.voiceMode })),
  resume: (sessionId) => set({ isActive: true, sessionId, currentQuestion: null, messages: [], evaluations: [], voiceMode: true }),
  reset: () => set({ isActive: false, sessionId: null, currentQuestion: null, messages: [], evaluations: [], voiceMode: true }),
}))
