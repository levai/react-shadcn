import { lazy } from 'react'
import { createBrowserRouter, createHashRouter, Navigate, type RouteObject } from 'react-router-dom'
import { LazyLoad } from '@/shared/ui'
import { env } from '@/shared/config'
import { ROUTES } from '@/shared/constants'
import { MainLayout, AuthLayout } from '@/app/layouts'
import { ProtectedRoute } from '@/features/auth'
import { Home, LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react'

// 路由组件懒加载
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'))

// 扩展路由配置类型，用于侧边栏生成
export type AppRouteConfig = RouteObject & {
  meta?: {
    title?: string
    icon?: LucideIcon
    hideInMenu?: boolean
  }
  children?: AppRouteConfig[]
}

/**
 * 核心业务路由配置
 * 这些路由会显示在侧边栏中（除非 hideInMenu: true）
 * 注意：所有主布局路由都需要使用 ProtectedRoute 保护
 */
export const menuRoutes: AppRouteConfig[] = [
  {
    path: ROUTES.HOME,
    meta: { title: '首页', icon: Home },
    element: (
      <ProtectedRoute>
        <LazyLoad>
          <HomePage />
        </LazyLoad>
      </ProtectedRoute>
    ),
  },
  // 示例路由（占位，后续可替换为实际页面组件）
  {
    path: ROUTES.DASHBOARD,
    meta: { title: '概览', icon: LayoutDashboard },
    element: (
      <ProtectedRoute>
        <div className="p-4">Dashboard Placeholder</div>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.USERS,
    meta: { title: '', icon: Users }, // title 由 routeTitleMap 映射提供，这里留空作为后备
    element: (
      <ProtectedRoute>
        <LazyLoad>
          <UserManagementPage />
        </LazyLoad>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    meta: { title: '设置', icon: Settings },
    element: (
      <ProtectedRoute>
        <div className="p-4">Settings Placeholder</div>
      </ProtectedRoute>
    ),
  },
]

/**
 * 完整路由配置
 * 使用 Data Router API (createBrowserRouter/createHashRouter)
 */
const routes: RouteObject[] = [
  // 认证布局路由（无需保护）
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <LazyLoad>
            <LoginPage />
          </LazyLoad>
        ),
      },
    ],
  },

  // 主布局路由（需要认证保护）
  {
    element: <MainLayout />,
    children: menuRoutes as RouteObject[], // 注入菜单路由
  },

  // 404 重定向
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]

// 根据环境配置创建路由器
const createRouter = env.routerMode === 'hash' ? createHashRouter : createBrowserRouter
export const router = createRouter(routes)
