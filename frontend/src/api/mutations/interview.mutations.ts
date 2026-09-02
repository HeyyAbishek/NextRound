import { apiClient } from '@/api/axios-client'
import type { InterviewQuestion, AnswerEvaluation } from '@/types/interview.types'

interface StartInterviewPayload {
  role: string
  job_description: string
}

interface StartInterviewResponse {
  session_id: string
  question: InterviewQuestion
}

interface SubmitAnswerPayload {
  session_id: string
  answer: string
}

interface SubmitAnswerResponse {
  evaluation: AnswerEvaluation
  is_complete: boolean
  next_question?: InterviewQuestion
  report?: Record<string, unknown>
}

export async function startInterview(
  payload: StartInterviewPayload,
): Promise<StartInterviewResponse> {
  const { data } = await apiClient.post<StartInterviewResponse>(
    '/api/interview/start',
    payload,
  )
  return data
}

export async function submitAnswer(
  payload: SubmitAnswerPayload,
): Promise<SubmitAnswerResponse> {
  const { data } = await apiClient.post<SubmitAnswerResponse>(
    '/api/interview/answer',
    payload,
  )
  return data
}
