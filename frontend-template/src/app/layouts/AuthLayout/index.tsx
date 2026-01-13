import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/shared/ui'

export function AuthLayout() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/50'>
      <div className='absolute right-4 top-4 md:right-8 md:top-8'>
        <ThemeToggle />
      </div>
      <div className='w-full max-w-md space-y-8 px-4 sm:px-0'>
        <Outlet />
      </div>
    </div>
  )
}
