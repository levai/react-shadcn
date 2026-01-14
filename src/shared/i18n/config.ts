import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { env } from '@/shared/config'
import { STORAGE_KEYS } from '@/shared/constants'

// 导入语言资源
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

/**
 * 获取初始语言（从 localStorage 读取）
 * 完全由 store 控制，这里只作为 i18n 初始化的回退
 */
function getInitialLanguage(): string {
  if (typeof window === 'undefined') return 'zh-CN'

  // 从 store 的 localStorage key 读取（使用统一的 key）
  const stored = localStorage.getItem(STORAGE_KEYS.I18N)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed?.state?.language || 'zh-CN'
    } catch {
      // 解析失败，使用默认值
    }
  }

  return 'zh-CN'
}

/**
 * i18n 配置
 *
 * 支持的语言：
 * - zh-CN: 简体中文（默认）
 * - en-US: 英语
 *
 * 注意：语言完全由 Zustand store 控制，i18n 只负责翻译
 */
i18n
  // 传入 react-i18next
  .use(initReactI18next)
  // 初始化 i18next（不使用 LanguageDetector，完全由 store 控制）
  .init({
    // 初始语言（从 store 读取）
    lng: getInitialLanguage(),
    // 默认语言
    fallbackLng: 'zh-CN',
    // 支持的语言列表（必须精确匹配）
    supportedLngs: ['zh-CN', 'en-US'],
    // 只加载当前语言，不加载回退语言
    load: 'currentOnly',
    debug: env.isDev,
    // 命名空间
    defaultNS: 'common',
    // 命名空间列表
    ns: ['common', 'auth', 'layout', 'home'],
    // 资源
    resources: {
      'zh-CN': {
        common: zhCN.common,
        auth: zhCN.auth,
        layout: zhCN.layout,
        home: zhCN.home,
      },
      'en-US': {
        common: enUS.common,
        auth: enUS.auth,
        layout: enUS.layout,
        home: enUS.home,
      },
    },
    // 插值配置
    interpolation: {
      escapeValue: false, // React 已经转义
    },
  })

export default i18n
