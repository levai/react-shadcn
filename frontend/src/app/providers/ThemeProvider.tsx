import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { getThemeIds } from '@/shared/config/themes'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * 主题 Provider
 * 提供深色/浅色主题切换功能
 * 支持自定义主题（theme-blue 等）
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem themes={getThemeIds()}>
      {children}
    </NextThemesProvider>
  )
}
