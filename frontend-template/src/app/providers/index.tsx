import { ErrorBoundaryProvider } from './ErrorBoundaryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToasterProvider } from './ToasterProvider'
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
 * 2. ThemeProvider - 主题提供，影响全局样式
 * 3. AppRouter - 路由提供
 * 4. ToasterProvider - Toast 通知（无需包裹 children）
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundaryProvider>
      <ThemeProvider>
        {children || <AppRouter />}
        <ToasterProvider />
      </ThemeProvider>
    </ErrorBoundaryProvider>
  )
}
