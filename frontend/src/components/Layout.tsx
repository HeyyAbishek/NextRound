import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useHomeStore } from '@/pages/home/useHomeStore'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'
import { ROUTES } from '@/lib/paths'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { path: ROUTES.home, label: 'Home' },
  { path: ROUTES.dashboard, label: 'Dashboard' },
  { path: ROUTES.settings, label: 'Settings' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const resetHome = useHomeStore((s) => s.reset)
  const resetInterview = useInterviewStore((s) => s.reset)
  const isInterviewPage = location.pathname === ROUTES.interview

  if (isInterviewPage) return <Outlet />

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <nav className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <Link to={ROUTES.home} className="text-lg font-bold text-violet-600">
            InterviewForge
          </Link>
          <div className="hidden sm:flex gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-md transition-colors',
                  location.pathname === item.path
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-muted-foreground">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  logout()
                  resetHome()
                  resetInterview()
                  navigate(ROUTES.login)
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="sm:hidden bg-white border-b px-4 py-2 flex gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'text-sm px-3 py-1.5 rounded-md transition-colors',
              location.pathname === item.path
                ? 'bg-violet-50 text-violet-700 font-medium'
                : 'text-muted-foreground',
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
