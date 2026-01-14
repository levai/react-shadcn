/**
 * 主题配置中心
 * 统一管理所有主题的配置信息
 */

import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  /** 主题 ID（对应 CSS class 名称） */
  id: string
  /** 显示名称 */
  label: string
  /** 图标组件 */
  icon: LucideIcon
  /** 是否为深色模式 */
  isDark: boolean
}

/**
 * 所有可用主题配置
 */
export const THEMES: ThemeConfig[] = [
  {
    id: 'light',
    label: '浅色模式',
    icon: Sun,
    isDark: false,
  },
  {
    id: 'dark',
    label: '深色模式',
    icon: Moon,
    isDark: true,
  },
  {
    id: 'theme-blue',
    label: '蓝色主题',
    icon: Palette,
    isDark: true,
  },
  {
    id: 'system',
    label: '跟随系统',
    icon: Monitor,
    isDark: false, // system 会根据系统设置动态变化
  },
]

/**
 * 获取主题配置
 */
export function getThemeConfig(themeId: string): ThemeConfig | undefined {
  return THEMES.find((theme) => theme.id === themeId)
}

/**
 * 获取所有主题 ID 列表（用于 next-themes）
 */
export function getThemeIds(): string[] {
  return THEMES.map((theme) => theme.id)
}

/**
 * 判断主题是否为深色模式
 */
export function isThemeDark(themeId: string): boolean {
  const config = getThemeConfig(themeId)
  if (!config) return false

  // system 主题需要特殊处理
  if (themeId === 'system') {
    // 这里可以根据系统设置判断，但通常由 next-themes 处理
    return false
  }

  return config.isDark
}
