import { create } from 'zustand'
import type { Session } from '@/types/session.types'

interface DashboardState {
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sessions: [],
  setSessions: (sessions) => set({ sessions }),
}))
