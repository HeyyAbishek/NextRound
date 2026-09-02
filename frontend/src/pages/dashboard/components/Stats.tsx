import { Card, CardContent } from '@/components/ui/card'
import { ClipboardListIcon, CheckCircle2Icon, ClockIcon, TrendingUpIcon } from 'lucide-react'

interface StatsProps {
  totalSessions: number
  completedSessions: number
  inProgressSessions: number
  averageScore: number | null
}

interface StatCardProps {
  label: string
  value: string | number
  Icon: typeof ClipboardListIcon
  accent: string
  iconBg: string
}

function StatCard({ label, value, Icon, accent, iconBg }: StatCardProps) {
  return (
    <Card className="border-violet-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <CardContent className="pt-6 pb-5 px-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${accent}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Stats({ totalSessions, completedSessions, inProgressSessions, averageScore }: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        label="Total"
        value={totalSessions}
        Icon={ClipboardListIcon}
        accent="text-violet-600"
        iconBg="bg-violet-50"
      />
      <StatCard
        label="Completed"
        value={completedSessions}
        Icon={CheckCircle2Icon}
        accent="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <StatCard
        label="In Progress"
        value={inProgressSessions}
        Icon={ClockIcon}
        accent="text-amber-600"
        iconBg="bg-amber-50"
      />
      <StatCard
        label="Avg Score"
        value={averageScore !== null ? `${averageScore.toFixed(1)}` : '—'}
        Icon={TrendingUpIcon}
        accent="text-sky-600"
        iconBg="bg-sky-50"
      />
    </div>
  )
}
