import { ErrorBoundaryProvider } from './ErrorBoundaryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToasterProvider } from './ToasterProvider'
import { I18nProvider } from './I18nProvider'
import { AppRouter } from '@/routes'

interface ProvidersProps {
  children?: React.ReactNode
}

/**
 * 统一 Providers 组件
 * 按顺序组合所有全局 Provider
 * 
 * Provider 顺序说明：
 * 1. ErrorBoundaryProvider - 最外层，捕获所有错误
 * 2. I18nProvider - 国际化提供，需要在 ThemeProvider 之前
 * 3. ThemeProvider - 主题提供，影响全局样式
 * 4. AppRouter - 路由提供
 * 5. ToasterProvider - Toast 通知（无需包裹 children）
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundaryProvider>
      <I18nProvider>
        <ThemeProvider>
          {children || <AppRouter />}
          <ToasterProvider />
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundaryProvider>
  )
}
