import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn } from '@/shared/lib'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  // 获取当前显示的主题（使用 resolvedTheme 获取实际主题）
  const displayTheme = resolvedTheme || 'light'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Sun
            className={cn(
              'h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all',
              displayTheme === 'dark' && '-rotate-90 scale-0'
            )}
          />
          <Moon
            className={cn(
              'absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all',
              displayTheme === 'dark' && 'rotate-0 scale-100'
            )}
          />
          <span className='sr-only'>切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-36'>
        <DropdownMenuRadioGroup value={theme || 'system'} onValueChange={setTheme}>
          <DropdownMenuRadioItem value='light'>
            <Sun className='mr-2 h-4 w-4' />
            <span>浅色模式</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='dark'>
            <Moon className='mr-2 h-4 w-4' />
            <span>深色模式</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='system'>
            <Monitor className='mr-2 h-4 w-4' />
            <span>跟随系统</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
