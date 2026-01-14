import { getStorageKey } from '@/shared/config'

/**
 * 存储 key 常量
 * 统一管理所有 localStorage/sessionStorage 的 key
 * 使用 getStorageKey 确保带命名空间前缀
 */
export const STORAGE_KEYS = {
  /** i18n 语言设置 */
  I18N: getStorageKey('i18n'),
  AUTH: getStorageKey('auth'),
} as const
