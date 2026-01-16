import React, { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { PanelLeftClose, PanelLeft, Layers, GripVertical } from 'lucide-react'
import { useAppStore } from '@/shared/stores'
import { useTranslation } from '@/shared/i18n'
import { ROUTE_TITLE_MAP } from '@/shared/constants'
import { menuRoutes, type AppRouteConfig } from '@/routes'
import { cn } from '@/shared/lib'

const { Sider } = Layout

// 侧边栏宽度配置
const SIDEBAR_MIN_WIDTH = 200
const SIDEBAR_MAX_WIDTH = 400
const SIDEBAR_DEFAULT_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 64

// 拖动调整宽度的手柄组件
const ResizeHandle = memo(function ResizeHandle({
  onResize,
  onResizeEnd,
}: {
  onResize: (delta: number) => void
  onResizeEnd: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    startXRef.current = e.clientX
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current
      startXRef.current = e.clientX
      onResize(delta)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      onResizeEnd()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onResize, onResizeEnd])

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        'absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group z-50',
        'hover:bg-primary/30 transition-colors',
        isDragging && 'bg-primary/50'
      )}
    >
      {/* 拖动指示器 */}
      <div
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 -mr-1.5',
          'flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
          isDragging && 'opacity-100'
        )}
      >
        <GripVertical className="h-4 w-4 text-primary" />
      </div>
    </div>
  )
})

// 将路由配置转换为 Ant Design Menu 的 items
function convertRoutesToMenuItems(
  routes: AppRouteConfig[],
  t: (key: string) => string
): MenuProps['items'] {
  return routes
    .filter(route => route.meta && !route.meta.hideInMenu && route.path)
    .map(route => {
      const translationKey = route.path ? ROUTE_TITLE_MAP[route.path] : undefined
      const label = translationKey ? t(translationKey) : route.meta?.title || route.path || ''
      const Icon = route.meta?.icon

      return {
        key: route.path || '',
        icon: Icon ? <Icon className="h-5 w-5" /> : undefined,
        label: label,
      }
    })
}

// Logo 组件
const SidebarLogo = memo(function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={cn(
        'h-16 flex items-center shrink-0 border-b border-border/50',
        isCollapsed ? 'justify-center px-2' : 'px-4 gap-3'
      )}
    >
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/30">
        <Layers className="h-5 w-5 text-primary" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-foreground truncate tracking-wide">
            Templates
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-mono">Frontend Template</span>
        </div>
      )}
    </div>
  )
})

// 主布局组件
function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { preferences, toggleSidebar, updatePreferences } = useAppStore()
  const { t } = useTranslation('layout')
  const isCollapsed = preferences.sidebarCollapsed

  // 将路由配置转换为菜单项
  const menuItems = useMemo(() => convertRoutesToMenuItems(menuRoutes, t), [t])

  // 侧边栏宽度状态
  const [sidebarWidth, setSidebarWidth] = useState(
    preferences.sidebarWidth || SIDEBAR_DEFAULT_WIDTH
  )

  const handleToggle = useCallback(() => {
    toggleSidebar()
  }, [toggleSidebar])

  // 处理拖动调整宽度
  const handleResize = useCallback(
    (delta: number) => {
      if (isCollapsed) return
      setSidebarWidth(prev => {
        const newWidth = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, prev + delta))
        return newWidth
      })
    },
    [isCollapsed]
  )

  // 拖动结束时保存宽度
  const handleResizeEnd = useCallback(() => {
    updatePreferences({ sidebarWidth })
  }, [sidebarWidth, updatePreferences])

  // 计算实际宽度
  const actualWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth

  // 处理菜单点击
  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      navigate(key)
    },
    [navigate]
  )

  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname
    return [currentPath]
  }, [location.pathname])

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  return (
    <Sider
      width={actualWidth}
      collapsed={isCollapsed}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      className="relative flex flex-col h-screen border-r border-border/50"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
      theme="light"
      breakpoint="md"
      onBreakpoint={broken => {
        // 在移动端自动折叠侧边栏
        if (broken && !isCollapsed) {
          toggleSidebar()
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* 拖动调整宽度手柄 - 仅展开时显示 */}
        {!isCollapsed && <ResizeHandle onResize={handleResize} onResizeEnd={handleResizeEnd} />}

        {/* Logo 区域 */}
        <SidebarLogo isCollapsed={isCollapsed} />

        {/* 导航菜单 */}
        <div
          className="overflow-y-auto overflow-x-hidden py-2"
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={handleMenuClick}
            className="flex-1"
            style={{ border: 'none' }}
          />
        </div>

        {/* 底部：收起菜单按钮 */}
        <div
          className={cn('py-3 border-t border-border/50 shrink-0', isCollapsed ? 'px-1.5' : 'px-2')}
        >
          <Tooltip
            title={isCollapsed ? t('sidebar.expandMenuShortcut') : undefined}
            placement="right"
            mouseEnterDelay={0.3}
          >
            <button
              onClick={handleToggle}
              className={cn(
                'flex items-center rounded-lg transition-all duration-150',
                'cursor-pointer',
                'text-muted-foreground hover:text-foreground hover:bg-card/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isCollapsed ? 'h-11 w-11 justify-center mx-auto' : 'h-10 w-full px-3 gap-3'
              )}
            >
              {isCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <>
                  <PanelLeftClose className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{t('sidebar.collapseMenu')}</span>
                </>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </Sider>
  )
}

export { Sidebar }
