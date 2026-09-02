import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import Stats from '@/pages/dashboard/components/Stats'
import SessionHistory from '@/pages/dashboard/components/SessionHistory'
import { getSessions } from '@/api/requests/session.requests'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/lib/paths'
import { PlusIcon, HistoryIcon } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  const sessions = data?.sessions || []
  const completedSessions = sessions.filter((s) => s.is_complete).length
  const inProgressSessions = sessions.length - completedSessions
  const completedScores = sessions
    .map((s) => s.report?.total_score)
    .filter((s): s is number => typeof s === 'number')
  const averageScore = completedScores.length
    ? completedScores.reduce((a, b) => a + b, 0) / completedScores.length
    : null

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 px-6 sm:px-8 py-6 sm:py-8 shadow-lg">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" aria-hidden />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-fuchsia-300/20 rounded-full blur-3xl" aria-hidden />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-violet-100 text-sm font-medium">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">{firstName} 👋</h1>
            <p className="text-violet-100 text-sm mt-1">Here's a snapshot of your interview practice</p>
          </div>
          <Button
            size="lg"
            className="bg-white text-violet-700 hover:bg-violet-50 shadow-md self-start sm:self-auto"
            onClick={() => navigate(ROUTES.home)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            New Interview
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-violet-50/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <Stats
            totalSessions={sessions.length}
            completedSessions={completedSessions}
            inProgressSessions={inProgressSessions}
            averageScore={averageScore}
          />
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <HistoryIcon className="w-4 h-4 text-violet-600" />
              <h2 className="text-base sm:text-lg font-semibold">Session History</h2>
              <span className="text-xs text-muted-foreground">({sessions.length})</span>
            </div>
            <SessionHistory sessions={sessions} />
          </div>
        </>
      )}
    </div>
  )
}
