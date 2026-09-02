export interface UploadResumePayload {
  resume: File
  jobDescription: File | string
  role: string
}

export interface UserProfile {
  id: string
  role: string
  resumeUploaded: boolean
}
