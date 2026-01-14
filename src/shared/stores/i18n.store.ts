import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/constants'

/** 支持的语言代码 */
export type SupportedLanguage = 'zh-CN' | 'en-US'

/** 语言项 */
export interface LanguageItem {
  /** 语言代码 */
  code: SupportedLanguage
  /** 显示标签 */
  label: string
  /** 国旗 emoji */
  flag: string
}

/** 支持的语言列表 */
export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
] as const

/** i18n 存储 key */
const I18N_STORAGE_KEY = STORAGE_KEYS.I18N

/**
 * 规范化语言代码
 * 将各种语言代码格式转换为支持的语言代码
 */
function normalizeLanguage(lang: string | null | undefined): SupportedLanguage {
  if (!lang) return 'zh-CN'

  // 已经是规范化的语言代码，直接返回
  if (lang === 'zh-CN' || lang === 'en-US') {
    return lang
  }

  // 处理简化的语言代码（如 "en" -> "en-US", "zh" -> "zh-CN"）
  if (lang === 'en' || lang.startsWith('en-')) {
    return 'en-US'
  }
  if (lang === 'zh' || lang.startsWith('zh-')) {
    return 'zh-CN'
  }

  // 默认返回中文
  return 'zh-CN'
}

/**
 * 获取初始语言值
 * 优先从 localStorage 读取，如果没有则使用 i18n 当前语言
 */
function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'zh-CN'

  // 优先从项目 storage key 读取
  const stored = localStorage.getItem(I18N_STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed?.state?.language) {
        return normalizeLanguage(parsed.state.language)
      }
    } catch {
      // 解析失败，继续使用其他方式
    }
  }

  // 如果没有存储的值，返回默认语言
  return 'zh-CN'
}

interface I18nState {
  /** 当前语言 */
  language: SupportedLanguage
  /** 切换语言 */
  changeLanguage: (lang: SupportedLanguage) => void
}

export const useI18nStore = create<I18nState>()(
  persist(
    set => ({
      language: getInitialLanguage(),
      changeLanguage: lang => {
        set({ language: lang })
        // 不在这里同步到 i18n，由 I18nProvider 统一处理
      },
    }),
    {
      name: I18N_STORAGE_KEY,
      // 只持久化语言代码
      partialize: state => ({
        language: state.language,
      }),
      // 恢复后处理：规范化语言代码
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('I18n store hydration error:', error)
        } else if (state) {
          // 规范化语言代码（处理旧数据）
          const normalized = normalizeLanguage(state.language)
          if (normalized !== state.language) {
            state.language = normalized
          }
        }
      },
    }
  )
)
