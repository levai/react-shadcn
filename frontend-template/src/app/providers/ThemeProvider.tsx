import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * 主题 Provider
 * 提供深色/浅色主题切换功能
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute='class' defaultTheme='dark' enableSystem>
      {children}
    </NextThemesProvider>
  )
}
