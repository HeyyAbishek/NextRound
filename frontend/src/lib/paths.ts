export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  interview: '/interview',
  settings: '/settings',
  report: (sessionId: string) => `/report/${sessionId}`,
} as const
