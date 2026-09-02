import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { uploadResume } from '@/api/mutations/settings.mutations'

interface ResumeSectionProps {
  resumeName: string | null
  hasResume: boolean
  isLoading: boolean
  onUploaded: () => void
}

export default function ResumeSection({
  resumeName,
  hasResume,
  isLoading,
  onUploaded,
}: ResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: () => onUploaded(),
  })

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB')
        return
      }
      mutation.mutate(file)
      e.target.value = ''
    },
    [mutation],
  )

  return (
    <Card className="border-violet-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-violet-700">Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : hasResume ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 text-xs font-semibold">
                PDF
              </div>
              <div>
                <p className="text-sm font-medium">{resumeName}</p>
                <p className="text-xs text-muted-foreground">Uploaded and processed</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-violet-200 text-violet-700 hover:bg-violet-50"
              disabled={mutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {mutation.isPending ? 'Uploading...' : 'Replace'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload your resume to get personalized interview questions
            </p>
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              disabled={mutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {mutation.isPending ? 'Uploading...' : 'Upload Resume (PDF)'}
            </Button>
          </div>
        )}

        {mutation.isError && (
          <p className="text-sm text-destructive mt-2">Upload failed. Please try again.</p>
        )}
      </CardContent>
    </Card>
  )
}
