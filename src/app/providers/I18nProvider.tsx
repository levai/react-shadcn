import { useEffect } from 'react'
import { useI18nStore } from '@/shared/stores'
import i18n from '@/shared/i18n' // 导入 i18n 实例（会自动初始化）

interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * i18n Provider
 *
 * 初始化 i18n 配置，确保在应用启动时加载
 * 使用 Zustand store 统一管理语言状态，符合项目架构
 *
 * 职责：
 * 1. 初始化时从 store 读取语言并同步到 i18n
 * 2. 监听 store 语言变化并同步到 i18n
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const { language } = useI18nStore()

  // 同步 store 的语言到 i18n
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  return <>{children}</>
}
