import { useTheme } from 'next-themes'
import { Toaster } from 'sonner'

/**
 * Toast 通知 Provider
 * 提供全局 Toast 通知功能，自动适配主题
 */
export function ToasterProvider() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-center"
      richColors
      // 主题适配：使用当前主题，如果未设置则使用 'system'（自动检测）
      theme={(theme as 'light' | 'dark' | 'system') || 'system'}
    />
  )
}
