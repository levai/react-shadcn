import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { useAppStore } from '@/shared/stores'
import { useMediaQuery } from '@/shared/hooks'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const { Content } = Layout

export function MainLayout() {
  const { preferences } = useAppStore()
  const isCollapsed = preferences.sidebarCollapsed
  const sidebarWidth = preferences.sidebarWidth || 260
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Layout className="h-screen overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 - 移动端时不需要左边距，桌面端根据侧边栏宽度调整 */}
      <Layout
        className="h-screen"
        style={{
          marginLeft: isMobile ? 0 : isCollapsed ? 64 : sidebarWidth,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header />

        <Content className="overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
