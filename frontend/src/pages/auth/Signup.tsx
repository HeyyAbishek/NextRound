import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signup } from '@/api/mutations/auth.mutations'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/lib/paths'
import AuthSidebar from '@/pages/auth/components/AuthSidebar'

export default function Signup() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => signup({ name, email, password }),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      navigate(ROUTES.home)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthSidebar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start practicing interviews with AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">Something went wrong. Try again.</p>
            )}

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="text-violet-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
