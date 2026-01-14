import { useTheme } from 'next-themes'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { THEMES, getThemeConfig } from '@/shared/config/themes'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  // 获取当前显示的主题（使用 resolvedTheme 获取实际主题）
  const displayTheme = resolvedTheme || 'light'

  // 获取当前主题的配置
  const currentThemeConfig = getThemeConfig(displayTheme)
  const CurrentIcon = currentThemeConfig?.icon || THEMES[0].icon

  // 从统一配置生成菜单项
  const menuItems: MenuProps['items'] = THEMES.map(themeConfig => {
    const Icon = themeConfig.icon
    return {
      key: themeConfig.id,
      label: (
        <span className="flex items-center">
          <span className="mr-2 flex h-4 w-4 items-center justify-center">
            <Icon className="h-4 w-4" />
          </span>
          <span>{themeConfig.label}</span>
        </span>
      ),
      onClick: () => setTheme(themeConfig.id),
    }
  })

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button size="small" shape="circle" icon={<CurrentIcon className="h-4 w-4" />}></Button>
    </Dropdown>
  )
}
