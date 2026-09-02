import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import InterviewerPanel from '@/pages/interview/components/InterviewerPanel'
import ChatPanel from '@/pages/interview/components/ChatPanel'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'
import { useHomeStore } from '@/pages/home/useHomeStore'
import { startInterview, submitAnswer } from '@/api/mutations/interview.mutations'
import { getInterviewStatus } from '@/api/requests/interview.requests'
import { getSessionDetail } from '@/api/requests/session.requests'
import { useSpeechSynthesis } from '@/shared/hooks/useSpeechSynthesis'
import { ROUTES } from '@/lib/paths'

export default function Interview() {
  const navigate = useNavigate()
  const { isSpeaking, speak, stop: stopSpeech } = useSpeechSynthesis()
  const { role, jobDescription } = useHomeStore()
  const {
    isActive,
    sessionId,
    voiceMode,
    currentQuestion,
    messages,
    setActive,
    setSessionId,
    setCurrentQuestion,
    addMessage,
    addEvaluation,
    reset,
  } = useInterviewStore()

  const startMutation = useMutation({
    mutationFn: () => startInterview({ role, job_description: jobDescription }),
    onSuccess: (data) => {
      setSessionId(data.session_id)
      setActive(true)
      setCurrentQuestion(data.question)
      addMessage({ role: 'interviewer', content: data.question.text })
      if (voiceMode) speak(data.question.text)
    },
  })

  const answerMutation = useMutation({
    mutationFn: (answer: string) =>
      submitAnswer({ session_id: sessionId!, answer }),
    onSuccess: (data) => {
      addEvaluation({
        questionId: currentQuestion?.id || '',
        score: data.evaluation.score,
        feedback: data.evaluation.feedback,
      })

      if (data.is_complete) {
        addMessage({
          role: 'interviewer',
          content: 'Interview complete! Generating your report...',
        })
        navigate(ROUTES.report(sessionId!))
      } else if (data.next_question) {
        setCurrentQuestion(data.next_question)
        addMessage({ role: 'interviewer', content: data.next_question.text })
        if (voiceMode) speak(data.next_question.text)
      }
    },
  })

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  useEffect(() => {
    if (isActive && sessionId) {
      if (messages.length > 0) return
      Promise.all([getSessionDetail(sessionId), getInterviewStatus(sessionId)])
        .then(([detail, status]) => {
          for (const q of detail.questions) {
            addMessage({ role: 'interviewer', content: q.text })
            addMessage({ role: 'user', content: q.answer })
            addEvaluation({ questionId: q.id, score: q.score, feedback: q.feedback })
          }
          if (status.current_question) {
            setCurrentQuestion(status.current_question)
            addMessage({ role: 'interviewer', content: status.current_question.text })
            if (voiceMode) speak(status.current_question.text)
          }
        })
        .catch(() => navigate(ROUTES.home))
      return
    }
    if (!role) {
      navigate(ROUTES.home)
      return
    }
    reset()
    startMutation.mutate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmitAnswer = (answer: string) => {
    addMessage({ role: 'user', content: answer })
    answerMutation.mutate(answer)
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-violet-600">InterviewForge</span>
          <span className="hidden sm:inline text-sm text-muted-foreground">|</span>
          <span className="hidden sm:inline text-sm font-medium">{role}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-violet-200 text-violet-700 hover:bg-violet-50"
          onClick={() => navigate(ROUTES.home)}
        >
          Exit
        </Button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r bg-white p-4 sm:p-6 overflow-y-auto max-h-[30vh] lg:max-h-none">
          <InterviewerPanel />
        </div>
        <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col flex-1 min-h-0">
          <ChatPanel
            onSubmitAnswer={handleSubmitAnswer}
            isSubmitting={answerMutation.isPending}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    </div>
  )
}
