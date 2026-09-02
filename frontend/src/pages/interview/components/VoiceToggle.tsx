import { Button } from '@/components/ui/button'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'

interface VoiceToggleProps {
  isListening: boolean
  onStart: () => void
  onStop: () => void
}

export default function VoiceToggle({ isListening, onStart, onStop }: VoiceToggleProps) {
  const { voiceMode, toggleVoiceMode } = useInterviewStore()

  const handleToggle = () => {
    if (voiceMode) {
      onStop()
    } else {
      onStart()
    }
    toggleVoiceMode()
  }

  return (
    <div className="flex items-center gap-2">
      {voiceMode && (
        <span className="flex items-center gap-1.5 text-xs text-violet-600 font-medium">
          <span className="relative flex h-2 w-2">
            {isListening && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isListening ? 'bg-violet-600' : 'bg-violet-300'}`} />
          </span>
          {isListening ? 'Listening' : 'Paused'}
        </span>
      )}
      <Button
        variant={voiceMode ? 'default' : 'outline'}
        size="sm"
        className={voiceMode
          ? 'bg-violet-600 hover:bg-violet-700'
          : 'border-violet-200 text-violet-700 hover:bg-violet-50'
        }
        onClick={handleToggle}
      >
        {voiceMode ? 'Voice ON' : 'Voice OFF'}
      </Button>
    </div>
  )
}
