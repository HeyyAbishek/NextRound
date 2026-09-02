import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import ScoreCard from '@/pages/report/components/ScoreCard'
import FeedbackList from '@/pages/report/components/FeedbackList'
import { getSessionDetail } from '@/api/requests/session.requests'
import { ROUTES } from '@/lib/paths'

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSessionDetail(sessionId!),
    enabled: !!sessionId,
  })

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading report...</div>
  }

  if (!data || !data.report) {
    return <div className="p-8 text-muted-foreground">Report not available yet.</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Interview Report</h1>
          <p className="text-sm text-muted-foreground">Role: {data.role}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
            onClick={() => navigate(ROUTES.dashboard)}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => navigate(ROUTES.home)}
          >
            New Interview
          </Button>
        </div>
      </div>

      <ScoreCard
        totalScore={data.report.total_score}
        strengths={data.report.strengths}
        weaknesses={data.report.weaknesses}
        summary={data.report.summary}
      />

      <FeedbackList questions={data.questions} />
    </div>
  )
}
