import { useEffect } from 'react'
import '@/shared/i18n' // 初始化 i18n

interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * i18n Provider
 * 
 * 初始化 i18n 配置，确保在应用启动时加载
 */
export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // i18n 已在导入时初始化，这里可以添加额外的初始化逻辑
    // 例如：从服务器加载语言资源、同步语言设置等
  }, [])

  return <>{children}</>
}
