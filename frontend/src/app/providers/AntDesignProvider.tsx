'use client'

import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useTheme } from 'next-themes'
import { useMemo, useEffect, useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import {
  getCurrentThemeClass,
  isDarkMode,
  getThemeTokens,
  getThemeComponents,
} from '@/shared/config/theme'

interface AntDesignProviderProps {
  children: React.ReactNode
}

/**
 * Ant Design Provider
 * 配置 Ant Design 主题，继承 Tailwind CSS 的颜色系统
 * 支持自定义主题（.theme-blue, .theme-purple 等）
 */
export function AntDesignProvider({ children }: AntDesignProviderProps) {
  const { resolvedTheme } = useTheme()
  const { i18n } = useTranslation()
  const [themeClass, setThemeClass] = useState<string>(() => getCurrentThemeClass())

  // 监听 DOM 变化，检测主题 class 切换
  useEffect(() => {
    const updateThemeClass = () => {
      setThemeClass(getCurrentThemeClass())
    }

    // 初始检查
    updateThemeClass()

    // 监听 DOM 变化（主题切换时 class 会变化）
    const observer = new MutationObserver(updateThemeClass)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [resolvedTheme])

  // 根据当前语言获取 Ant Design 的 locale
  const antdLocale = useMemo(() => {
    const currentLang = i18n.language || 'zh-CN'
    return currentLang === 'en-US' ? enUS : zhCN
  }, [i18n.language])

  // Ant Design 主题配置
  // 使用 CSS Variables 模式，Ant Design 会自动生成 CSS 变量
  // token 中的颜色值会从当前主题的 CSS 变量读取
  const antdTheme = useMemo(() => {
    const isDark = isDarkMode(themeClass)

    return {
      // 启用 CSS Variables 模式
      // Ant Design 会自动将 token 中的颜色值转换为 CSS 变量
      cssVar: {
        prefix: 'ant',
        key: 'ant-design',
      },
      // 使用 algorithm 来处理深色/浅色模式的衍生颜色
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      // 从主题配置获取 token
      token: getThemeTokens(themeClass),
      // 从主题配置获取组件配置
      components: getThemeComponents(themeClass),
    }
  }, [themeClass])

  return (
    <ConfigProvider theme={antdTheme} locale={antdLocale}>
      {children}
    </ConfigProvider>
  )
}
