export interface StartInterviewPayload {
  role: string
}

export interface InterviewQuestion {
  id: string
  text: string
  type: string
}

export interface AnswerPayload {
  questionId: string
  answer: string
}

export interface AnswerEvaluation {
  questionId: string
  score: number
  feedback: string
}

export interface InterviewReport {
  sessionId: string
  totalScore: number
  strengths: string[]
  weaknesses: string[]
  questions: {
    question: string
    answer: string
    score: number
    feedback: string
  }[]
}
