/**
 * 路由路径常量
 * 导航跳转时使用，禁止硬编码路径字符串
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/settings',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * 路由路径到翻译键的映射
 * 用于侧边栏和顶部导航栏的标题显示
 */
export const ROUTE_TITLE_MAP: Record<string, string> = {
  [ROUTES.HOME]: 'nav.home',
  [ROUTES.DASHBOARD]: 'nav.overview',
  [ROUTES.USERS]: 'nav.users',
  [ROUTES.SETTINGS]: 'nav.settings',
} as const
