import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'
import { useHomeStore } from '@/pages/home/useHomeStore'
import { ROUTES } from '@/lib/paths'
import type { Session } from '@/types/session.types'
import { BriefcaseIcon, FileTextIcon, PlayIcon, ArrowRightIcon, SparklesIcon, CalendarIcon } from 'lucide-react'

function formatSessionDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface SessionHistoryProps {
  sessions: Session[]
}

function StatusBadge({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Completed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      In Progress
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 6 ? 'bg-sky-50 text-sky-700 border-sky-200'
    : 'bg-rose-50 text-rose-700 border-rose-200'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${tone}`}>
      <SparklesIcon className="w-3 h-3" />
      {score.toFixed(1)}/10
    </span>
  )
}

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  const navigate = useNavigate()
  const resume = useInterviewStore((s) => s.resume)
  const setRole = useHomeStore((s) => s.setRole)

  if (sessions.length === 0) {
    return (
      <Card className="border-dashed border-violet-200 bg-gradient-to-br from-violet-50/50 to-white">
        <CardContent className="py-14 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-100 mx-auto flex items-center justify-center mb-3">
            <BriefcaseIcon className="w-6 h-6 text-violet-600" />
          </div>
          <p className="font-medium">No interview sessions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start your first mock interview to see it here</p>
          <Button
            className="mt-4 bg-violet-600 hover:bg-violet-700"
            onClick={() => navigate(ROUTES.home)}
          >
            Start your first interview
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleResume = (session: Session) => {
    setRole(session.role)
    resume(session.session_id)
    navigate(ROUTES.interview)
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const score = session.total_score ?? session.report?.total_score
        const dateLabel = formatSessionDate(session.created_at)
        return (
          <Card
            key={session.session_id}
            className="border-violet-100 shadow-sm hover:shadow-md hover:border-violet-300 transition-all group"
          >
            <CardContent className="flex items-center justify-between gap-4 py-4 px-5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center flex-shrink-0 group-hover:from-violet-200 group-hover:to-violet-100 transition-colors">
                  <BriefcaseIcon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{session.role}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {session.question_count}/{session.max_questions} questions
                    </span>
                    <StatusBadge complete={session.is_complete} />
                    {typeof score === 'number' && <ScoreBadge score={score} />}
                  </div>
                  {dateLabel && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{dateLabel}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!session.is_complete && (
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => handleResume(session)}
                  >
                    <PlayIcon className="w-3.5 h-3.5 mr-1" />
                    Resume
                  </Button>
                )}
                {session.is_complete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
                    onClick={() => navigate(ROUTES.report(session.session_id))}
                  >
                    <FileTextIcon className="w-3.5 h-3.5 mr-1" />
                    Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
