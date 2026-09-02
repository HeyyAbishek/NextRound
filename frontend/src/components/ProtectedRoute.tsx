import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/lib/paths'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <>{children}</>
}
