export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
}
