import { Card, CardContent } from '@/components/ui/card'

interface ScoreCardProps {
  totalScore: number
  strengths: string[]
  weaknesses: string[]
  summary: string
}

export default function ScoreCard({
  totalScore,
  strengths,
  weaknesses,
  summary,
}: ScoreCardProps) {
  return (
    <div className="space-y-4">
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-sm">
        <CardContent className="pt-6 text-center">
          <p className="text-5xl font-bold text-violet-600">{totalScore}</p>
          <p className="text-muted-foreground mt-1">Overall Score</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{summary}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-green-100 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="text-sm space-y-1">
              {strengths.map((s, i) => (
                <li key={i} className="text-green-600">+ {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-amber-700 mb-2">Areas to Improve</h3>
            <ul className="text-sm space-y-1">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-amber-600">- {w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
