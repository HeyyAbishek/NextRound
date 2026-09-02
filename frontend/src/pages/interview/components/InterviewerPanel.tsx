import { Card, CardContent } from '@/components/ui/card'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'

export default function InterviewerPanel() {
  const { currentQuestion, evaluations } = useInterviewStore()
  const lastEvaluation = evaluations[evaluations.length - 1]

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold text-violet-700">Interviewer</h2>

      {currentQuestion && (
        <Card className="border-violet-100 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
                {currentQuestion.id}
              </span>
              <span className="text-xs text-muted-foreground capitalize">{currentQuestion.type}</span>
            </div>
            <p className="text-sm">{currentQuestion.text}</p>
          </CardContent>
        </Card>
      )}

      {lastEvaluation && (
        <Card className="border-green-100 shadow-sm">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-1">Last Feedback</p>
            <p className="text-sm">
              Score: <span className="font-semibold text-violet-600">{lastEvaluation.score}/10</span>
            </p>
            <p className="text-sm mt-1 text-muted-foreground">{lastEvaluation.feedback}</p>
          </CardContent>
        </Card>
      )}

      {!currentQuestion && evaluations.length === 0 && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-sm">Preparing your interview...</span>
        </div>
      )}
    </div>
  )
}
