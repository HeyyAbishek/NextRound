import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL as string
if (!API_BASE_URL) throw new Error('VITE_API_URL is not set')

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
