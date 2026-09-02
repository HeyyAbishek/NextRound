import { create } from 'zustand'

interface HomeState {
  role: string
  jobDescription: string
  sessionId: string | null
  setRole: (role: string) => void
  setJobDescription: (jd: string) => void
  setSessionId: (id: string) => void
  reset: () => void
}

export const useHomeStore = create<HomeState>((set) => ({
  role: '',
  jobDescription: '',
  sessionId: null,
  setRole: (role) => set({ role }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  setSessionId: (id) => set({ sessionId: id }),
  reset: () => set({ role: '', jobDescription: '', sessionId: null }),
}))
