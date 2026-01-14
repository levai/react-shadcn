# UI 组件规范

## UI 组件库

**项目完全使用 Ant Design 作为主要 UI 组件库，Tailwind CSS 仅用于布局和自定义样式补充。**

> 📖 **详细指南**：查看 [`antd-guide.md`](../antd-guide.md) 了解完整的使用规范和最佳实践。

```typescript
// ✅ 正确 - 从 antd 导入组件
import { Button, Input, Form, Card, Table, Modal, Row, Col, Space } from 'antd'

// ❌ 错误 - 不要从 @/shared/ui 导入 UI 组件（已移除）
import { Button } from '@/shared/ui'
```

## 核心原则

1. **优先使用 Ant Design 组件** - 能用 Ant Design 组件实现的，优先使用组件
2. **Tailwind CSS 作为补充** - 仅用于布局、间距、响应式等辅助样式
3. **保持一致性** - 所有 UI 组件统一使用 Ant Design 的设计语言

## Toast 通知

**使用 Ant Design 的 `message` API：**

```typescript
import { message } from 'antd'

message.success('操作成功')
message.error('操作失败')
message.warning('请注意')
message.info('提示信息')
```

**或者使用 `sonner`（用于非 Ant Design 场景）：**

```typescript
import { toast } from 'sonner'

toast.success('操作成功')
toast.error('操作失败')
```

## 主题管理

### 使用 ThemeToggle 组件

**推荐方式：使用 `ThemeToggle` 组件**

```typescript
import { ThemeToggle } from '@/shared/ui'

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

**组件特性：**

- 使用 Ant Design 的 `Button` 和 `Dropdown` 组件
- 按钮为圆形小尺寸（`size="small" shape="circle"`）
- 按钮图标会根据当前主题自动更新（显示对应主题的图标）
- 下拉菜单显示所有可用主题，每个主题都有对应的图标和标签
- 支持自定义主题（如 `theme-blue`）

**实现变化：**
- ✅ **统一按钮样式**：与 `LanguageToggle` 使用相同的按钮样式（`size="small" shape="circle"`）
- ✅ **配置驱动**：从 `src/shared/config/themes.ts` 统一配置中心读取主题列表
- ✅ **图标自动切换**：不再使用固定的 Sun/Moon 切换，而是显示当前主题对应的图标

**手动切换主题（不推荐）：**

```typescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark') // 'light' | 'dark' | 'system' | 'theme-blue'
```

Ant Design 的主题会自动继承 Tailwind CSS 的主题配置（通过 `AntDesignProvider`）。

> 📖 **详细指南**：查看 [`themes/custom-themes.md`](../themes/custom-themes.md) 了解如何创建自定义主题。

## 图标

**统一使用 `lucide-react`**：

```typescript
import { Home, Settings, User } from 'lucide-react'

<Button icon={<Home className="h-4 w-4" />}>首页</Button>
```

**图标大小规范：**

- 按钮图标：`h-4 w-4` (16px)
- 菜单项图标：`h-4 w-4` (16px)
- 大尺寸图标：`h-5 w-5` (20px)

## 语言切换

**使用 `LanguageToggle` 组件：**

```typescript
import { LanguageToggle } from '@/shared/ui'

function Header() {
  return (
    <header>
      <LanguageToggle />
    </header>
  )
}
```

**组件特性：**

- 使用 Ant Design 的 `Button` 和 `Dropdown` 组件
- 按钮为圆形小尺寸（`size="small" shape="circle"`）
- 下拉菜单显示所有支持的语言，当前语言会显示 ✓ 标记
- 图标使用 `lucide-react` 的 `Languages` 图标

**实现变化：**
- ✅ **统一按钮样式**：与 `ThemeToggle` 使用相同的按钮样式（`size="small" shape="circle"`）
- ✅ **图标统一**：使用 Ant Design 的 `icon` prop 传递图标，图标大小为 `h-4 w-4`
- ✅ **简化实现**：移除了不必要的样式类和嵌套结构

> 📖 **详细指南**：查看 [`i18n.md`](./i18n.md) 了解国际化配置。

## 表单

**使用 Ant Design 的 `Form` 组件：**

```typescript
import { Form, Input, Button } from 'antd'

const [form] = Form.useForm()

<Form
  form={form}
  layout="vertical"
  onFinish={handleSubmit}
  initialValues={{ username: '', password: '' }}
>
  <Form.Item
    name="username"
    label="用户名"
    rules={[{ required: true, message: '请输入用户名' }]}
  >
    <Input placeholder="请输入用户名" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">提交</Button>
  </Form.Item>
</Form>
```

## 样式规范

### Tailwind CSS 使用场景

Tailwind CSS **仅用于以下场景**：

1. **布局和间距**

   ```typescript
   <div className="flex items-center gap-4">
   <div className="p-4 space-y-2">
   ```

2. **响应式断点**

   ```typescript
   <div className="hidden md:block">
   ```

3. **自定义样式补充**
   ```typescript
   <Card className="custom-shadow">
   ```

### 避免使用 Tailwind CSS 的场景

1. **组件样式** - 使用 Ant Design 组件的内置样式
2. **颜色** - 使用 Ant Design 的主题系统
3. **间距** - 优先使用 Ant Design 的 `Space`、`gap` 属性
4. **圆角** - 使用 Ant Design 的 `borderRadius` 配置

### 使用 `cn()` 合并类名

```typescript
import { cn } from '@/shared/lib'

// ✅ 正确 - 用于布局和辅助样式
<div className={cn('flex items-center', isActive && 'bg-primary/10')} />

// ❌ 错误 - 不要用 Tailwind 实现组件样式
<Button className={cn('bg-primary text-white')} />
```

## Ant Design 组件使用示例

### Button

```typescript
import { Button } from 'antd'
import { Plus } from 'lucide-react'

<Button type="primary" icon={<Plus className="h-4 w-4" />}>
  创建
</Button>
<Button type="default">默认按钮</Button>
<Button type="text">文本按钮</Button>
<Button danger>危险按钮</Button>
```

### Table

```typescript
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const columns: ColumnsType<DataType> = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '操作', key: 'actions', render: (_, record) => <Button>编辑</Button> },
]

<Table columns={columns} dataSource={data} rowKey="id" />
```

### Modal

```typescript
import { Modal } from 'antd'

<Modal
  open={isOpen}
  onCancel={handleCancel}
  title="标题"
  footer={null}
  destroyOnHidden
>
  {/* 内容 */}
</Modal>
```

### Card

```typescript
import { Card, Spin } from 'antd'

<Card>
  <Spin spinning={loading}>
    {/* 内容 */}
  </Spin>
</Card>
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

Ant Design 会自动继承这些 CSS 变量（通过 `AntDesignProvider` 配置）。

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

| 用途         | 类名                    | 说明                 |
| ------------ | ----------------------- | -------------------- |
| 主色         | `text-primary`          | 主色调               |
| 次要文本     | `text-muted-foreground` | 次要文本色           |
| 主要文本     | `text-foreground`       | 主要文本色           |
| 背景         | `bg-card`               | 卡片背景             |
| 边框         | `border-border`         | 边框色               |
| Hover 背景   | `hover:bg-card/80`      | 80% 透明度的卡片背景 |
| 激活状态背景 | `bg-primary/15`         | 15% 透明度的主色背景 |
| 激活状态文本 | `text-primary`          | 主色文本             |

### 功能规范

#### 宽度配置

```typescript
const SIDEBAR_MIN_WIDTH = 200 // 最小宽度
const SIDEBAR_MAX_WIDTH = 400 // 最大宽度
const SIDEBAR_DEFAULT_WIDTH = 260 // 默认宽度
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
import { Tooltip } from 'antd'

<Tooltip title={item.label} placement="right" mouseEnterDelay={0.3}>
  {content}
</Tooltip>
```

### 菜单数据源

**必须从路由配置获取：**

```typescript
import { menuRoutes, type AppRouteConfig } from '@/routes'

// 将路由配置转换为导航分组
function convertRoutesToNavGroups(routes: AppRouteConfig[]): NavGroupType[] {
  const visibleRoutes = routes.filter(route => route.meta && !route.meta.hideInMenu && route.path)
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
- [ ] 所有颜色使用标准 Tailwind CSS 类名
- [ ] 支持快捷键 Ctrl+B / Cmd+B
- [ ] 折叠状态下显示 Tooltip（使用 Ant Design Tooltip）
- [ ] 拖动调整宽度功能正常
- [ ] 宽度限制在 200-400px 之间
- [ ] 状态管理使用 `useAppStore`
- [ ] 菜单数据从 `menuRoutes` 获取
- [ ] 结构顺序正确（Logo → 菜单 → 收起按钮）
