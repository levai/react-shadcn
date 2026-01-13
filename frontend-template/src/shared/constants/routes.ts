/**
 * 路由路径常量
 * 导航跳转时使用，禁止硬编码路径字符串
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
