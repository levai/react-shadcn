import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Toaster } from 'sonner'
import { getCurrentThemeClass, isDarkMode } from '@/shared/config/theme'

/**
 * Toast 通知 Provider
 * 提供全局 Toast 通知功能，自动适配主题
 * 支持自定义主题（theme-blue 等）
 *
 * 实现方式：
 * - 根据当前主题的 isDark 配置自动设置 sonner 的 theme prop（'light' 或 'dark'）
 * - 使用 richColors 启用丰富的颜色区分（Success=绿色，Error=红色，Warning=橙色，Info=蓝色）
 * - 自定义主题会根据其 isDark 配置自动使用对应的主题模式
 */
export function ToasterProvider() {
  const { resolvedTheme } = useTheme()
  const [themeClass, setThemeClass] = useState<string>(() => getCurrentThemeClass())

  // 监听 DOM 变化，检测主题 class 切换（与 AntDesignProvider 保持一致）
  useEffect(() => {
    const updateThemeClass = () => {
      setThemeClass(getCurrentThemeClass())
    }

    // 初始检查
    updateThemeClass()

    // 监听 DOM 变化（主题切换时 class 会变化）
    const observer = new MutationObserver(updateThemeClass)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [resolvedTheme])

  // 根据当前主题 class 判断是否为深色模式
  // sonner 的 theme 只支持 'light' | 'dark' | 'system'
  // 对于自定义主题（如 theme-blue），根据其 isDark 配置来决定使用 'light' 或 'dark'
  const toastTheme = isDarkMode(themeClass) ? 'dark' : 'light'

  return <Toaster position="top-center" richColors theme={toastTheme} />
}
