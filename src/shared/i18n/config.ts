import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { env } from '@/shared/config'

// 导入语言资源
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

/**
 * i18n 配置
 *
 * 支持的语言：
 * - zh-CN: 简体中文（默认）
 * - en-US: 英语
 */
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 传入 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 默认语言
    fallbackLng: 'zh-CN',
    // 支持的语言列表
    supportedLngs: ['zh-CN', 'en-US'],
    // 调试模式（开发环境开启）
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
    // 语言检测配置
    detection: {
      // 检测顺序：localStorage > navigator > 默认语言
      order: ['localStorage', 'navigator'],
      // localStorage 键名
      lookupLocalStorage: 'i18nextLng',
      // 缓存用户选择
      caches: ['localStorage'],
    },
  })

export default i18n
