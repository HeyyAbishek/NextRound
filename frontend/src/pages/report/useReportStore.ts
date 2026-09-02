import { create } from 'zustand'
import type { InterviewReport } from '@/types/interview.types'

interface ReportState {
  report: InterviewReport | null
  setReport: (report: InterviewReport) => void
}

export const useReportStore = create<ReportState>((set) => ({
  report: null,
  setReport: (report) => set({ report }),
}))
