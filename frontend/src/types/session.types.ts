export interface Session {
  session_id: string
  role: string
  question_count: number
  max_questions: number
  is_complete: boolean
  total_score?: number | null
  created_at?: string | null
  questions?: {
    id: string
    text: string
    type: string
    answer: string
    score: number
    feedback: string
  }[]
  report?: {
    total_score: number
    strengths: string[]
    weaknesses: string[]
    summary: string
    questions: Record<string, unknown>[]
  } | null
}

export interface ProgressData {
  totalSessions: number
  averageScore: number
  strengths: string[]
  weaknesses: string[]
  sessions: Session[]
}
