import { apiClient } from '@/api/axios-client'
import type { Session } from '@/types/session.types'

interface SessionsResponse {
  sessions: Session[]
}

export async function getSessions(): Promise<SessionsResponse> {
  const { data } = await apiClient.get<SessionsResponse>('/api/sessions')
  return data
}

export async function getSessionDetail(sessionId: string): Promise<Session> {
  const { data } = await apiClient.get<Session>(`/api/sessions/${sessionId}`)
  return data
}
