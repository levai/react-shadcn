/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 应用命名空间，用于缓存、store等功能的前缀 */
  readonly VITE_APP_NAMESPACE: string
  /** 资源公共路径，需要以 / 开头和结尾 */
  readonly VITE_PUBLIC_BASE: string
  /** 路由模式：hash | history */
  readonly VITE_ROUTER_MODE: 'hash' | 'history'
  /** API 基础 URL */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
