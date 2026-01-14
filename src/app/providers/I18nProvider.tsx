import { useEffect } from 'react'
import i18n from '@/shared/i18n' // 初始化 i18n

interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * i18n Provider
 *
 * 初始化 i18n 配置，确保在应用启动时加载
 * 确保语言设置从 localStorage 正确恢复
 */
export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // i18n 已在导入时初始化，但需要确保语言设置正确恢复
    // 从 localStorage 读取语言设置并同步到 i18n
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return <>{children}</>
}
