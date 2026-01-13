import React, { memo, useCallback, useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeft, Layers, GripVertical } from 'lucide-react'
import { useAppStore } from '@/shared/stores'
import { menuRoutes, type AppRouteConfig } from '@/routes'
import { cn } from '@/shared/lib'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@/shared/ui'

// 导航项类型
type NavItemType = {
  id: string
  path: string
  icon: React.ComponentType<{ className?: string }> | undefined
  label: string
  visible: boolean
  children?: Array<{ path: string; label: string }>
}

// 侧边栏宽度配置
const SIDEBAR_MIN_WIDTH = 200
const SIDEBAR_MAX_WIDTH = 400
const SIDEBAR_DEFAULT_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 64

// 单个导航项组件
const SidebarNavItem = memo(function SidebarNavItem({
  item,
  isCollapsed,
}: {
  item: NavItemType
  isCollapsed: boolean
}) {
  const Icon = item.icon
  const hasChildren = Array.isArray(item.children) && item.children.length > 0

  const content = (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          'group flex items-center rounded-lg transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isCollapsed
            ? 'h-11 w-11 justify-center mx-auto'
            : 'h-11 px-3 gap-3',
          isActive
            ? 'bg-primary/15 text-primary shadow-sm'
            : 'text-muted-foreground hover:bg-card/80 hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={cn(
                'shrink-0 transition-colors h-5 w-5',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
          )}
          {!isCollapsed && (
            <span className="text-sm font-medium truncate">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={6}>
            {item.label}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="space-y-1">
      {content}
      {hasChildren && (
        <div className="ml-9 space-y-1">
          {item.children!.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                cn(
                  'block text-sm px-2 py-1.5 rounded-md transition-all',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:bg-card/80 hover:text-foreground'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
})

// 导航分组类型
type NavGroupType = {
  id: string
  title: string
  items: NavItemType[]
  visible: boolean
}

// 导航分组组件
const SidebarNavGroup = memo(function SidebarNavGroup({
  group,
  isCollapsed,
  isFirst,
}: {
  group: NavGroupType
  isCollapsed: boolean
  isFirst: boolean
}) {
  return (
    <div className={cn(isCollapsed ? (!isFirst && 'mt-8') : (!isFirst && 'mt-6'))}>
      {/* 分组标题 */}
      {!isCollapsed ? (
        <div className="px-3 mb-2">
          <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
            {group.title}
          </span>
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <div className="w-6 h-px bg-border/50" />
        </div>
      )}

      {/* 导航项列表 */}
      <div
        className={cn(
          'flex flex-col',
          isCollapsed ? 'gap-3 px-1.5' : 'gap-1 px-2'
        )}
      >
        {group.items.map((item) => (
          <SidebarNavItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>
    </div>
  )
})

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

// 将路由配置转换为导航分组
function convertRoutesToNavGroups(routes: AppRouteConfig[]): NavGroupType[] {
  // 过滤出需要显示的菜单项
  const visibleRoutes = routes.filter(
    (route) => route.meta && !route.meta.hideInMenu && route.path
  )

  // 将所有菜单项放在一个默认分组中
  const items: NavItemType[] = visibleRoutes.map((route) => ({
    id: route.path || '',
    path: route.path || '#',
    icon: route.meta?.icon,
    label: route.meta?.title || route.path || '',
    visible: true,
  }))

  return [
    {
      id: 'default',
      title: '菜单',
      items,
      visible: true,
    },
  ]
}

// 主布局组件
function Sidebar() {
  const { preferences, toggleSidebar, updatePreferences } = useAppStore()
  const isCollapsed = preferences.sidebarCollapsed

  // 将路由配置转换为导航分组
  const navGroups = convertRoutesToNavGroups(menuRoutes)

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
      setSidebarWidth((prev) => {
        const newWidth = Math.min(
          SIDEBAR_MAX_WIDTH,
          Math.max(SIDEBAR_MIN_WIDTH, prev + delta)
        )
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
    <aside
      style={{ width: actualWidth }}
      className={cn(
        'relative flex flex-col shrink-0',
        'bg-gradient-to-b from-card/60 to-card/40',
        'border-r border-border',
        'transition-[width] duration-200 ease-out'
      )}
    >
      {/* 拖动调整宽度手柄 - 仅展开时显示 */}
      {!isCollapsed && (
        <ResizeHandle onResize={handleResize} onResizeEnd={handleResizeEnd} />
      )}

      {/* Logo 区域 */}
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
            <span className="text-[10px] text-muted-foreground/60 font-mono">
              Frontend Template
            </span>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          isCollapsed ? 'py-6' : 'py-4',
          'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50'
        )}
      >
        {navGroups.map((group, index) => (
          <SidebarNavGroup
            key={group.id}
            group={group}
            isCollapsed={isCollapsed}
            isFirst={index === 0}
          />
        ))}
      </nav>

      {/* 底部：收起菜单按钮 */}
      <div
        className={cn(
          'py-3 border-t border-border/50 shrink-0',
          isCollapsed ? 'px-1.5' : 'px-2'
        )}
      >
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleToggle}
                  className={cn(
                    'flex items-center rounded-lg transition-all duration-150',
                    'text-muted-foreground hover:text-foreground hover:bg-card/80',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isCollapsed
                    ? 'h-11 w-11 justify-center mx-auto'
                    : 'h-10 w-full px-3 gap-3'
                )}
              >
                {isCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <>
                    <PanelLeftClose className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">收起菜单</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={6}>
                展开菜单 (Ctrl+B)
                <TooltipArrow />
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
}

export { Sidebar }
