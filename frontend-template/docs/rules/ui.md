# UI 组件规范

## Toast 通知

使用 `sonner` 库：

```typescript
import { toast } from 'sonner'

toast.success('操作成功')
toast.error('操作失败')
toast.warning('请注意')
toast.info('提示信息')
```

## 主题管理

使用 `next-themes`：

```typescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark') // 'light' | 'dark' | 'system'
```

## 图标

**统一使用 `lucide-react`**：

```typescript
import { Home, Settings, User } from 'lucide-react'

;<Home className='h-5 w-5' />
```

## 表单

使用 `react-hook-form` + `zod`：

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '密码至少6位'),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

## 样式规范

1. **使用 Tailwind CSS 类名**
2. **使用 `cn()` 合并类名**
3. **使用 CSS 变量**
4. **避免内联样式**

```typescript
import { cn } from '@/shared/lib'

;<div className={cn('px-4 py-2 rounded-md', 'bg-primary text-primary-foreground', isActive && 'ring-2 ring-ring')} />
```

## CSS 变量

| 变量            | 用途   |
| --------------- | ------ |
| `--background`  | 背景色 |
| `--foreground`  | 前景色 |
| `--primary`     | 主色   |
| `--secondary`   | 次色   |
| `--muted`       | 弱色   |
| `--destructive` | 危险色 |

## 响应式设计

| 断点  | 宽度   |
| ----- | ------ |
| `sm:` | 640px  |
| `md:` | 768px  |
| `lg:` | 1024px |
| `xl:` | 1280px |

## 侧边栏开发规范

### 位置与结构

侧边栏组件位于：`src/app/layouts/MainLayout/Sidebar.tsx`

**结构顺序（必须严格遵守）：**
1. Logo 区域（顶部）
2. 导航菜单（中间，flex-1）
3. 收起菜单按钮（底部）

### 样式规范

#### 背景样式

**必须使用渐变背景：**

```typescript
className={cn(
  'bg-gradient-to-b from-card/60 to-card/40',
  'border-r border-border'
)}
```

#### Hover 效果

**统一使用标准类名：**

```typescript
// ✅ 正确 - 导航项 hover
'text-muted-foreground hover:bg-card/80 hover:text-foreground'

// ✅ 正确 - 图标 hover
'text-muted-foreground group-hover:text-foreground'

// ❌ 错误 - 禁止使用 accent
'hover:bg-accent hover:text-accent-foreground'
```

#### 颜色类名

**必须使用 shadcn/ui 标准类名：**

| 用途           | 类名                    | 说明                    |
| -------------- | ----------------------- | ----------------------- |
| 主色           | `text-primary`          | 主色调                  |
| 次要文本       | `text-muted-foreground` | 次要文本色              |
| 主要文本       | `text-foreground`       | 主要文本色              |
| 背景           | `bg-card`               | 卡片背景                |
| 边框           | `border-border`         | 边框色                  |
| Hover 背景     | `hover:bg-card/80`      | 80% 透明度的卡片背景    |
| 激活状态背景   | `bg-primary/15`         | 15% 透明度的主色背景     |
| 激活状态文本   | `text-primary`          | 主色文本                |

### 功能规范

#### 宽度配置

```typescript
const SIDEBAR_MIN_WIDTH = 200      // 最小宽度
const SIDEBAR_MAX_WIDTH = 400      // 最大宽度
const SIDEBAR_DEFAULT_WIDTH = 260  // 默认宽度
const SIDEBAR_COLLAPSED_WIDTH = 64 // 折叠宽度
```

**禁止修改这些常量值**，如需调整需团队讨论。

#### 状态管理

**必须使用 `useAppStore`：**

```typescript
import { useAppStore } from '@/shared/stores'

const { preferences, toggleSidebar, updatePreferences } = useAppStore()
const isCollapsed = preferences.sidebarCollapsed
```

#### 快捷键支持

**必须支持 Ctrl+B / Cmd+B 切换：**

```typescript
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
```

#### 拖动调整宽度

**必须实现拖动调整宽度功能：**

- 仅在展开状态下显示拖动手柄
- 拖动时限制在最小/最大宽度之间
- 拖动结束时保存宽度到 preferences

#### Tooltip 提示

**折叠状态下必须显示 Tooltip：**

```typescript
<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild>{content}</TooltipTrigger>
    <TooltipContent side="right" sideOffset={6}>
      {item.label}
      <TooltipArrow />
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 菜单数据源

**必须从路由配置获取：**

```typescript
import { menuRoutes, type AppRouteConfig } from '@/routes'

// 将路由配置转换为导航分组
function convertRoutesToNavGroups(routes: AppRouteConfig[]): NavGroupType[] {
  const visibleRoutes = routes.filter(
    (route) => route.meta && !route.meta.hideInMenu && route.path
  )
  // ...
}
```

### 禁止事项

1. ❌ **禁止添加菜单管理功能**（已移除，不再需要）
2. ❌ **禁止添加系统状态显示**（已移除，不再需要）
3. ❌ **禁止使用自定义主题类名**（如 `tactical-*`），必须使用标准类名
4. ❌ **禁止修改结构顺序**（Logo → 菜单 → 收起按钮）
5. ❌ **禁止使用内联样式**，必须使用 Tailwind 类名
6. ❌ **禁止硬编码颜色值**，必须使用 CSS 变量

### 代码检查清单

开发侧边栏相关功能时，请检查：

- [ ] 背景使用渐变样式 `bg-gradient-to-b from-card/60 to-card/40`
- [ ] Hover 效果使用 `hover:bg-card/80 hover:text-foreground`
- [ ] 所有颜色使用标准 shadcn/ui 类名
- [ ] 支持快捷键 Ctrl+B / Cmd+B
- [ ] 折叠状态下显示 Tooltip
- [ ] 拖动调整宽度功能正常
- [ ] 宽度限制在 200-400px 之间
- [ ] 状态管理使用 `useAppStore`
- [ ] 菜单数据从 `menuRoutes` 获取
- [ ] 结构顺序正确（Logo → 菜单 → 收起按钮）
