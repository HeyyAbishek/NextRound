import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ResumeSection from '@/pages/settings/components/ResumeSection'
import { getProfile } from '@/api/requests/settings.requests'
import { useAuthStore } from '@/shared/stores/useAuthStore'

export default function Settings() {
  const user = useAuthStore((s) => s.user)

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and resume</p>
      </div>

      {/* Profile Info */}
      <Card className="border-violet-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-violet-700">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-lg font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume */}
      <ResumeSection
        resumeName={profile?.resume_name || null}
        hasResume={profile?.has_resume || false}
        isLoading={isLoading}
        onUploaded={() => refetch()}
      />
    </div>
  )
}
