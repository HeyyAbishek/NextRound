import { apiClient } from '@/api/axios-client'

interface UploadResumeResponse {
  message: string
  resume_name: string
}

export async function uploadResume(file: File): Promise<UploadResumeResponse> {
  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await apiClient.post<UploadResumeResponse>(
    '/api/settings/resume',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}
