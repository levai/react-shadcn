import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/features/auth'
import { useAppStore } from '@/shared/stores'
import { ROUTES, ROUTE_TITLE_MAP } from '@/shared/constants'
import { useTranslation } from '@/shared/i18n'
import { ThemeToggle, LanguageToggle } from '@/shared/ui'
import { LogOut, Menu } from 'lucide-react'
import { menuRoutes } from '@/routes'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useAppStore()
  // 加载多个命名空间：layout 作为默认，auth 作为辅助
  const { t } = useTranslation(['layout', 'auth'])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  // 获取当前页面标题
  const currentRoute = menuRoutes.find(route => route.path === location.pathname)
  const translationKey = currentRoute?.path ? ROUTE_TITLE_MAP[currentRoute.path] : null
  const pageTitle = translationKey
    ? t(translationKey)
    : currentRoute?.meta?.title || t('nav.dashboard')

  // 用户下拉菜单配置
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="flex flex-col space-y-1 leading-none py-1">
          <p className="font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.username}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <Space>
          <LogOut className="h-4 w-4" />
          <span>{t('auth:logout')}</span>
        </Space>
      ),
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-6 backdrop-blur">
      {/* 移动端菜单按钮 */}
      <Button
        type="text"
        icon={<Menu className="h-5 w-5" />}
        className="md:hidden"
        onClick={toggleSidebar}
      />

      <div className="flex flex-1 items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3 py-1">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />

        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button shape="circle">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" size="small" onClick={() => navigate(ROUTES.LOGIN)}>
            {t('auth:login')}
          </Button>
        )}
      </div>
    </header>
  )
}
