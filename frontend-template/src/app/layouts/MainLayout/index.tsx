import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Header />

        <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
          <div className='mx-auto max-w-7xl'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
