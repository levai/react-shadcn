/**
 * 全局应用状态管理 (App Store)
 *
 * 用途：存放跨功能的全局 UI 状态和用户偏好设置
 *
 * 应该放在这里的状态：
 * - ✅ 全局布局相关状态（侧边栏、导航栏等）
 * - ✅ 用户 UI 偏好设置（侧边栏宽度、折叠状态等）
 * - ✅ 跨功能的全局 UI 状态
 *
 * 不应该放在这里的状态：
 * - ❌ 业务功能状态（应放在 features/[feature]/model/）
 * - ❌ 认证状态（应放在 features/auth/model/auth.store.ts）
 * - ❌ 主题状态（使用 next-themes 管理）
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 用户偏好设置
export interface UserPreferences {
  sidebarCollapsed: boolean
  sidebarWidth: number
}

interface AppState {
  // 侧边栏
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // 用户偏好
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      toggleSidebar: () =>
        set(state => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: !state.preferences.sidebarCollapsed,
          },
        })),
      setSidebarCollapsed: collapsed =>
        set(state => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: collapsed,
          },
        })),

      // 用户偏好
      preferences: {
        sidebarCollapsed: false,
        sidebarWidth: 260,
      },
      updatePreferences: prefs => {
        set(state => ({
          preferences: { ...state.preferences, ...prefs },
        }))
      },
    }),
    {
      name: 'app-storage',
      partialize: state => ({
        preferences: state.preferences,
      }),
    }
  )
)
