import { apiClient } from '@/api/axios-client'

interface InterviewStatus {
  session_id: string
  role: string
  question_count: number
  max_questions: number
  is_complete: boolean
  current_question: { id: string; text: string; type: string } | null
}

export async function getInterviewStatus(
  sessionId: string,
): Promise<InterviewStatus> {
  const { data } = await apiClient.get<InterviewStatus>(
    `/api/interview/status/${sessionId}`,
  )
  return data
}

export async function getInterviewReport(
  sessionId: string,
): Promise<Record<string, unknown>> {
  const { data } = await apiClient.get(`/api/interview/report/${sessionId}`)
  return data
}
