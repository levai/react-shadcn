import { Toaster } from 'sonner'

/**
 * Toast 通知 Provider
 * 提供全局 Toast 通知功能
 */
export function ToasterProvider() {
  return <Toaster position="top-center" richColors />
}
