import { apiClient } from '@/api/axios-client'

export interface UserProfile {
  id: string
  name: string
  email: string
  resume_name: string | null
  has_resume: boolean
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/api/settings/profile')
  return data
}
