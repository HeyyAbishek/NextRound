const STATS = [
  { value: '5+', label: 'Question types' },
  { value: 'AI', label: 'Personalized feedback' },
  { value: 'Voice', label: 'Interview mode' },
  { value: 'RAG', label: 'Resume-powered' },
]

export default function AuthSidebar() {
  return (
    <>
      {/* Mobile: top banner */}
      <div className="lg:hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 text-white px-6 py-8 space-y-4">
        <h2 className="text-xl font-bold">InterviewForge</h2>
        <h3 className="text-2xl font-bold leading-tight">
          Practice smarter. Interview better. Land the job.
        </h3>
        <p className="text-white/80 text-sm">
          AI-powered mock interviews tailored to your resume, with real-time
          feedback and progress tracking.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: side panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 text-white p-10 xl:p-16 flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold">InterviewForge</h2>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
            Practice smarter.<br />Interview better.<br />Land the job.
          </h1>
          <p className="text-white/80 text-base xl:text-lg max-w-md">
            AI-powered mock interviews tailored to your resume, with real-time
            feedback and progress tracking across sessions.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/50">
          Powered by AI. Built for your success.
        </p>
      </div>
    </>
  )
}
