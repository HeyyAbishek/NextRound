import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useHomeStore } from '@/pages/home/useHomeStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useInterviewStore } from '@/pages/interview/useInterviewStore'
import { getProfile } from '@/api/requests/settings.requests'
import { ROUTES } from '@/lib/paths'

export default function Home() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { role, jobDescription, setRole, setJobDescription } = useHomeStore()
  const resetInterview = useInterviewStore((s) => s.reset)

  useEffect(() => {
    resetInterview()
  }, [resetInterview])

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const hasResume = profile?.has_resume || false
  const isReady = hasResume && jobDescription.trim() && role.trim()

  const handleStart = () => navigate(ROUTES.interview)

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Welcome */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Ready to practice{user ? `, ${user.name}` : ''}?
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Set up your interview and start practicing
          </p>
        </div>

        {/* Resume status */}
        {!hasResume && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-5 flex items-center justify-between">
              <p className="text-sm text-amber-800">Upload your resume to get started</p>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-800 hover:bg-amber-100"
                onClick={() => navigate(ROUTES.settings)}
              >
                Go to Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {hasResume && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center text-green-600 text-xs font-semibold">
                  PDF
                </div>
                <p className="text-sm text-green-800">{profile?.resume_name}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-700 hover:bg-green-100"
                onClick={() => navigate(ROUTES.settings)}
              >
                Change
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interview setup */}
        <Card className="border-violet-100 shadow-sm">
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role">Target Role</Label>
              <Input
                id="role"
                placeholder="e.g. Frontend Developer, Data Scientist..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="focus-visible:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jd">Job Description</Label>
              <Textarea
                id="jd"
                placeholder="e.g. We're looking for a Full Stack Developer with 3+ years of experience in React, Node.js, and PostgreSQL. You'll build scalable APIs, design responsive UIs, and collaborate with cross-functional teams in an agile environment..."
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="focus-visible:ring-violet-500"
              />
            </div>

            <Button
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={!isReady}
              onClick={handleStart}
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
