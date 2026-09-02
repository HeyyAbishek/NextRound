import { Card, CardContent } from '@/components/ui/card'

interface QuestionFeedback {
  text: string
  type: string
  answer: string
  score: number
  feedback: string
}

interface FeedbackListProps {
  questions: QuestionFeedback[]
}

function getScoreColor(score: number) {
  if (score >= 8) return 'text-green-600 bg-green-50'
  if (score >= 5) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export default function FeedbackList({ questions }: FeedbackListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">Question-by-Question Feedback</h2>
      {questions.map((q, i) => (
        <Card key={i} className="border-violet-100 shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
                  Q{i + 1}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{q.type}</span>
              </div>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getScoreColor(q.score)}`}>
                {q.score}/10
              </span>
            </div>
            <p className="font-medium text-sm">{q.text}</p>
            <div className="text-sm bg-muted/50 rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">Your answer</p>
              <p>{q.answer}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Feedback</p>
              <p>{q.feedback}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
