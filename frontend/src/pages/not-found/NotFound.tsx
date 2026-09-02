import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/lib/paths'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold text-violet-600">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to={ROUTES.home} className={cn(buttonVariants(), 'bg-violet-600 hover:bg-violet-700')}>
        Go Home
      </Link>
    </div>
  )
}
