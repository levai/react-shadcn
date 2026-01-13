import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { useAppStore } from '@/shared/stores'
import { ROUTES } from '@/shared/constants'
import {
  ThemeToggle,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/ui'
import { LogOut, Menu } from 'lucide-react'
import { menuRoutes } from '@/routes'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useAppStore()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  // 获取当前页面标题
  const currentRoute = menuRoutes.find(route => route.path === location.pathname)
  const pageTitle = currentRoute?.meta?.title || '控制台'

  return (
    <header className='sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-6 backdrop-blur'>
      {/* 移动端菜单按钮 */}
      <Button variant='ghost' size='icon' className='md:hidden' onClick={toggleSidebar}>
        <Menu className='h-5 w-5' />
      </Button>

      <div className='flex flex-1 items-center gap-4'>
        <h2 className='text-lg font-semibold text-foreground border-l-4 border-primary pl-3 py-1'>{pageTitle}</h2>
      </div>

      <div className='flex items-center gap-3'>
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='relative h-9 w-9 rounded-full border'>
                <div className='flex h-full w-full items-center justify-center rounded-full bg-muted'>
                  <span className='text-xs font-medium'>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <div className='flex items-center justify-start gap-2 p-2'>
                <div className='flex flex-col space-y-1 leading-none'>
                  <p className='font-medium'>{user.name}</p>
                  <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                </div>
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className='text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20'
              >
                <LogOut className='mr-2 h-4 w-4' />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant='default' size='sm' onClick={() => navigate(ROUTES.LOGIN)}>
            登录
          </Button>
        )}
      </div>
    </header>
  )
}
