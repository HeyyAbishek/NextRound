import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ROUTES } from '@/lib/paths'

const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const Home = lazy(() => import('@/pages/home/Home'))
const Interview = lazy(() => import('@/pages/interview/Interview'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const Report = lazy(() => import('@/pages/report/Report'))
const NotFound = lazy(() => import('@/pages/not-found/NotFound'))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
          <Routes>
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.signup} element={<Signup />} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path={ROUTES.home} element={<Home />} />
              <Route path={ROUTES.dashboard} element={<Dashboard />} />
              <Route path={ROUTES.settings} element={<Settings />} />
              <Route path="/report/:sessionId" element={<Report />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path={ROUTES.interview} element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
