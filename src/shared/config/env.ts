/**
 * 环境变量配置
 * 统一从此处导入，不要直接使用 import.meta.env
 */
export const env = {
  /** 应用标题 */
  title: import.meta.env.VITE_APP_TITLE || 'App',

  /** 应用命名空间，用于缓存、store等功能的前缀 */
  namespace: import.meta.env.VITE_APP_NAMESPACE || 'app',

  /** 路由模式 */
  routerMode: (import.meta.env.VITE_ROUTER_MODE || 'history') as 'hash' | 'history',

  /** API 基础 URL */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  /** 是否为开发环境 */
  isDev: import.meta.env.DEV,

  /** 是否为生产环境 */
  isProd: import.meta.env.PROD,

  /** 当前环境模式 */
  mode: import.meta.env.MODE,
} as const

/**
 * 获取带命名空间前缀的存储 key
 * @param key 原始 key
 * @returns 带前缀的 key
 */
export function getStorageKey(key: string): string {
  return `${env.namespace}:${key}`
}
