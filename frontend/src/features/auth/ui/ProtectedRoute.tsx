import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../model'
import { ROUTES } from '@/shared/constants'
import { PageLoader } from '@/shared/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 路由保护组件
 * 未登录时重定向到登录页
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
