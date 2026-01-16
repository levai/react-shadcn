/**
 * 主题工具函数
 * 处理主题检测和 Ant Design token 生成
 */

import type { ThemeConfig } from 'antd'
import { isThemeDark } from './themes'

/**
 * 获取当前应用的主题 class
 * 自动检测 DOM 上的 class，支持：
 * - .dark, .light (基础主题)
 * - .theme-* (自定义主题，如 .theme-blue, .theme-purple 等)
 */
export function getCurrentThemeClass(): string {
  if (typeof window === 'undefined') return 'dark'

  const html = document.documentElement
  const classList = html.classList

  // 动态检测所有自定义主题（.theme-* 格式）
  // 遍历所有 class，查找以 'theme-' 开头的自定义主题
  for (const className of classList) {
    if (className.startsWith('theme-')) {
      return className // 返回完整的主题 class 名称，如 'theme-blue'
    }
  }

  // 检查深色/浅色模式（基础主题）
  if (classList.contains('dark')) return 'dark'
  return 'light'
}

/**
 * 判断是否为深色模式
 * 使用统一的主题配置
 */
export function isDarkMode(themeClass: string): boolean {
  return isThemeDark(themeClass)
}

/**
 * 根据主题 class 获取对应的 CSS 变量值
 *
 * 注意：CSS 变量会根据 DOM 上的 class 自动应用，所以直接读取即可
 * themeClass 参数保留用于未来可能的扩展（如主题预览等场景）
 */
export function getThemeCSSVar(varName: string, _themeClass: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback

  try {
    // 直接读取 CSS 变量，CSS 会根据当前 DOM 上的主题 class 自动应用
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    return value || fallback
  } catch {
    return fallback
  }
}

/**
 * 将 HSL 字符串转换为 RGB 格式（用于 Ant Design token）
 */
export function hslToRgb(hsl: string): string {
  if (!hsl) return ''
  const parts = hsl.trim().split(/\s+/)
  if (parts.length < 3) return ''

  const h = parseFloat(parts[0]) / 360
  const s = parseFloat(parts[1].replace('%', '')) / 100
  const l = parseFloat(parts[2].replace('%', '')) / 100

  if (s === 0) {
    const gray = Math.round(l * 255)
    return `${gray}, ${gray}, ${gray}`
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const r = hue2rgb(p, q, h + 1 / 3)
  const g = hue2rgb(p, q, h)
  const b = hue2rgb(p, q, h - 1 / 3)

  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`
}

/**
 * 根据主题 class 生成 Ant Design token 配置
 */
export function getThemeTokens(themeClass: string): ThemeConfig['token'] {
  const isDark = isDarkMode(themeClass)

  // 获取 CSS 变量值（CSS 会根据主题 class 自动切换）
  const getVar = (name: string, fallback: string) => getThemeCSSVar(name, themeClass, fallback)

  const radius = parseFloat(getVar('--radius', '0.5')) * 16
  const primaryHsl = getVar('--primary', '165 95% 40%')
  const destructiveHsl = getVar('--destructive', '0 100% 64%')
  const backgroundHsl = getVar('--background', isDark ? '210 30% 7%' : '0 0% 100%')
  const cardHsl = getVar('--card', isDark ? '220 25% 10%' : '0 0% 98%')
  const foregroundHsl = getVar('--foreground', isDark ? '220 10% 91%' : '220 15% 20%')
  const mutedForegroundHsl = getVar('--muted-foreground', isDark ? '210 10% 60%' : '220 10% 45%')
  const borderHsl = getVar('--border', isDark ? '200 25% 22%' : '220 15% 85%')

  return {
    // 颜色 - 主色、成功、警告、错误、信息
    colorPrimary: `rgb(${hslToRgb(primaryHsl)})`,
    colorSuccess: `rgb(${hslToRgb(primaryHsl)})`,
    colorWarning: 'rgb(251, 191, 36)',
    colorError: `rgb(${hslToRgb(destructiveHsl)})`,
    colorInfo: `rgb(${hslToRgb(primaryHsl)})`,

    // 背景色
    colorBgContainer: `hsl(${backgroundHsl})`,
    colorBgElevated: `hsl(${cardHsl})`,
    colorBgLayout: `hsl(${backgroundHsl})`,

    // 文本色
    colorText: `hsl(${foregroundHsl})`,
    colorTextSecondary: `hsl(${mutedForegroundHsl})`,
    colorTextTertiary: `hsl(${mutedForegroundHsl})`,

    // 边框色
    colorBorder: `hsl(${borderHsl})`,
    colorBorderSecondary: `hsl(${borderHsl})`,

    // 其他
    borderRadius: radius,
    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  }
}

/**
 * 获取组件级别的主题配置
 */
export function getThemeComponents(themeClass: string): ThemeConfig['components'] {
  // 获取 CSS 变量值（CSS 会根据主题 class 自动切换）
  // 直接使用当前主题的 CSS 变量，fallback 仅作为最后的保险
  const getVar = (name: string, fallback: string) => getThemeCSSVar(name, themeClass, fallback)

  const radius = parseFloat(getVar('--radius', '0.5')) * 16
  // 直接读取当前主题的 CSS 变量值，不需要根据 isDark 判断
  const backgroundHsl = getVar('--background', '0 0% 100%')
  const foregroundHsl = getVar('--foreground', '220 15% 20%')
  const borderHsl = getVar('--border', '220 15% 85%')

  return {
    Button: {
      borderRadius: radius,
      controlHeight: 36,
      controlHeightSM: 32,
      controlHeightLG: 40,
    },
    Input: {
      borderRadius: radius,
      controlHeight: 36,
    },
    Card: {
      borderRadius: radius,
    },
    Modal: {
      borderRadius: radius,
    },
    Drawer: {
      borderRadius: radius,
    },
    Layout: {
      // Layout.Header 的主题配置
      headerBg: `hsl(${backgroundHsl})`,
      headerColor: `hsl(${foregroundHsl})`,
      headerPadding: '0 10px',
      // Layout.Sider 的主题配置
      siderBg: `hsl(${backgroundHsl})`,
      // Layout.Content 的主题配置
      bodyBg: `hsl(${backgroundHsl})`,
      // 边框色
      colorBorder: `hsl(${borderHsl})`,
    },
  }
}
