import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { getStorageKey } from '@/shared/config'

/** 认证存储 key */
const AUTH_STORAGE_KEY = getStorageKey('auth')

interface AuthState {
  /** 当前用户 */
  user: User | null
  /** 访问令牌 */
  accessToken: string | null
  /** 是否已认证（从 user 和 accessToken 推导） */
  isAuthenticated: boolean
  /** 是否正在加载（hydration 状态） */
  isLoading: boolean

  /** 登录 */
  login: (user: User, token: string) => void
  /** 登出 */
  logout: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, token) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true, // 确保与数据同步
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false, // 确保与数据同步
          isLoading: false,
        })
      },

      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      // 只持久化必要状态，isAuthenticated 会在恢复后重新计算
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      // 当 store 从 localStorage 恢复后，设置 isLoading 为 false，并重新计算 isAuthenticated
      // 符合 Zustand 5.0 官方最佳实践：在 onRehydrateStorage 回调中调用 state 上的方法
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Auth store hydration error:', error)
          // 如果恢复失败，清除可能损坏的数据
          if (state) {
            state.logout()
          }
        } else if (state) {
          // 恢复后重新计算 isAuthenticated，确保与数据同步
          // 注意：在 onRehydrateStorage 回调中，可以直接修改 state 的属性
          // 因为此时状态正在恢复过程中，这是官方推荐的方式
          state.isAuthenticated = !!state.user && !!state.accessToken
          state.setLoading(false)
        }
      },
    }
  )
)

// 导出存储 key，供其他模块使用
export { AUTH_STORAGE_KEY }
