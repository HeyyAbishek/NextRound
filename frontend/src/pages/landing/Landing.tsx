import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/paths'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    title: 'Personalized Questions',
    description: 'Upload your resume and job description — AI generates questions tailored to your experience.',
  },
  {
    title: 'Voice Interview Mode',
    description: 'Practice speaking your answers with browser-based speech recognition and synthesis.',
  },
  {
    title: 'Instant Feedback',
    description: 'Get real-time scoring and constructive feedback on every answer you give.',
  },
  {
    title: 'Progress Tracking',
    description: 'Memory system tracks your strengths and weaknesses across sessions.',
  },
  {
    title: 'Detailed Reports',
    description: 'Receive a comprehensive report with scores, strengths, and areas to improve.',
  },
  {
    title: 'Multiple Question Types',
    description: 'Behavioral, coding, and written questions — just like a real interview.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b px-4 sm:px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-violet-600">InterviewForge</span>
        <div className="flex gap-2">
          <Link to={ROUTES.login} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Sign In
          </Link>
          <Link to={ROUTES.signup} className={cn(buttonVariants({ size: 'sm' }), 'bg-violet-600 hover:bg-violet-700')}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 text-center max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium mb-6">
          AI-Powered Interview Prep
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Ace Your Next Interview{' '}
          <span className="text-violet-600">with AI</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
          InterviewForge gives you personalized mock interviews based on your resume,
          real-time feedback, and tracks your progress over time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to={ROUTES.signup} className={cn(buttonVariants({ size: 'lg' }), 'bg-violet-600 hover:bg-violet-700')}>
            Start Practicing Free
          </Link>
          <Link to={ROUTES.login} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8">
          Everything you need to prepare
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border hover:border-violet-200 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-700 text-white px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">Ready to ace your interview?</h2>
        <p className="text-white/80 mt-2 max-w-md mx-auto text-sm sm:text-base">
          Upload your resume, pick a role, and start practicing in minutes.
        </p>
        <Link
          to={ROUTES.signup}
          className={cn(buttonVariants({ size: 'lg' }), 'mt-6 bg-white text-violet-700 hover:bg-white/90')}
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 sm:px-6 py-6 text-center text-sm text-muted-foreground">
        InterviewForge — AI-Powered Mock Interviews
      </footer>
    </div>
  )
}
