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
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否正在加载 */
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
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // 当 store 从 localStorage 恢复后，设置 isLoading 为 false
      onRehydrateStorage: () => state => {
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)

// 导出存储 key，供其他模块使用
export { AUTH_STORAGE_KEY }
