import { useAuthStore } from '@/features/auth/model'

/**
 * 从 auth store 获取访问令牌
 * 可以在非 React 组件中使用（如拦截器）
 * @returns 访问令牌，如果不存在则返回 null
 */
export function getToken(): string | null {
  // 使用 Zustand store 的 getState() 方法，无需 React Hooks
  return useAuthStore.getState().accessToken
}
