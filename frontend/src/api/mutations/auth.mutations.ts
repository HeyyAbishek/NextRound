import { apiClient } from '@/api/axios-client'
import type { SignupPayload, LoginPayload, AuthResponse } from '@/types/auth.types'

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/signup', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', payload)
  return data
}
