# AI 编程助手统一规范

> 📖 **这是所有 AI 工具的统一规范源文件**
>
> ⚠️ **重要**: 此文件是唯一维护源，其他文件（`.cursor/rules/steering.mdc`、`.github/copilot-instructions.md`）应引用此文件。

本项目使用 **Feature-Sliced Design (FSD)** 架构，专为 AI 辅助编程优化。

## 技术栈

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS 4
- Zustand (状态管理)
- React Router 7 (路由)
- Axios (HTTP 客户端)
- react-i18next (国际化)
- ahooks (Hooks 库)
- sonner (Toast 通知)
- lucide-react (图标库)

## 目录结构 (FSD)

```
src/
├── app/              # 应用层：入口、Provider、布局
│   ├── providers/    # 全局 Provider 组件
│   └── layouts/      # 全局布局组件
├── features/         # 功能层：业务功能模块
│   └── [feature]/
│       ├── ui/       # UI 组件
│       ├── api/      # API 服务
│       ├── model/    # 状态管理 (Zustand)
│       ├── types/    # 类型定义
│       └── index.ts  # 统一导出（公共 API）
├── pages/            # 页面层：路由入口组件
│   └── [PageName]/
│       ├── [PageName].tsx
│       └── index.ts
├── shared/           # 共享层：工具、类型、配置
│   ├── ui/           # 基础 UI 组件
│   ├── hooks/        # 共享 Hooks
│   ├── i18n/         # 国际化
│   ├── api/          # HTTP 客户端
│   └── stores/       # 全局状态存储
└── routes/           # 路由配置
```

## 核心规则

### 路径别名

**必须使用 `@/` 前缀，禁止相对路径：**

```typescript
// ✅ 正确
import { LoginForm } from '@/features/auth'
import { cn } from '@/shared/lib'
import { useTranslation } from '@/shared/i18n'

// ❌ 错误
import { LoginForm } from '../../features/auth'
```

### 导入规则

1. **从 feature 的 `index.ts` 导入**，不要导入内部文件
2. **使用具名导入**，避免 `import *`
3. **共享 Hooks 从 `@/shared/hooks` 导入**

```typescript
// ✅ 正确
import { LoginForm, useAuthStore, authService } from '@/features/auth'
import { useRequest, useDebounce } from '@/shared/hooks'

// ❌ 错误
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAuthStore } from '@/features/auth/model/auth.store'
```

### 组件模式

**页面组件：**
```typescript
// 箭头函数 + 默认导出
const LoginPage = () => {
  const { t } = useTranslation('auth')
  
  return (
    <div>
      <h1>{t('loginPage.title')}</h1>
    </div>
  )
}
export default LoginPage
```

**功能组件：**
```typescript
// 函数声明 + 命名导出
export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation('auth')
  
  return (
    <form onSubmit={onSubmit}>
      <label>{t('form.email.label')}</label>
      <button>{t('actions.submit')}</button>
    </form>
  )
}
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `LoginForm.tsx` |
| 页面目录 | PascalCase + Page | `LoginPage/LoginPage.tsx` |
| Hooks | camelCase + use | `useAuthStore` |
| 服务 | camelCase + Service | `authService` |
| 类型 | PascalCase | `LoginRequest` |
| 常量 | UPPER_SNAKE_CASE | `ROUTES` |

### 状态管理 (Zustand)

**全局应用状态：**
```typescript
// 位置：src/shared/stores/app.store.ts
import { useAppStore } from '@/shared/stores'

// 用于：侧边栏状态、全局 UI 偏好等
```

**功能状态：**
```typescript
// 位置：src/features/[feature]/model/[feature].store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// 必须通过 feature 的 index.ts 导出
// features/auth/index.ts
export { useAuthStore } from './model'
```

### API 服务模式

```typescript
import { request } from '@/shared/api'

const API = {
  LOGIN: '/v1/auth/login',
  LOGOUT: '/v1/auth/logout',
} as const

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
}

const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(API.LOGIN, {
      method: 'POST',
      data,
    })
  },
}

export default authService
```

### ⭐ 数据请求：使用 `useRequest` Hook

**在 React 组件中，统一使用 `useRequest` 进行数据请求：**

```typescript
import { useRequest } from '@/shared/hooks'
import { userService } from '@/features/user'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useRequest(
    () => userService.getUser(userId),
    { refreshDeps: [userId] }
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>
  return <div>{user.name}</div>
}
```

**优势：**
- ✅ 自动管理 loading、error 状态
- ✅ 内置缓存、重试、轮询等功能
- ✅ 代码更简洁，减少样板代码

### 路由

**使用 ROUTES 常量，禁止硬编码路径：**

```typescript
import { ROUTES } from '@/shared/constants'
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// ✅ 正确
navigate(ROUTES.HOME)

// ❌ 错误
navigate('/')
```

**路由保护：**
```typescript
import { ProtectedRoute } from '@/features/auth'

<Route
  path={ROUTES.DASHBOARD}
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

**懒加载：**
```typescript
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/shared/ui'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
  </Routes>
</Suspense>
```

### 国际化 (i18n)

**基础用法：**
```typescript
import { useTranslation } from '@/shared/i18n'

function Component() {
  const { t } = useTranslation('common')
  
  // 使用嵌套结构的键（使用点号分隔）
  return <div>{t('actions.confirm')}</div>
}
```

**多个命名空间：**
```typescript
const { t } = useTranslation(['layout', 'auth'])

// 默认命名空间（layout）
t('nav.home')

// 其他命名空间（auth）
t('auth:loginPage.title')
```

**关键规则：**
- 始终使用 i18n - 禁止硬编码用户可见文本
- 使用嵌套键：`t('actions.confirm')` 而不是 `t('confirm')`
- 页面内容模式：`t('homePage.welcome.title')`
- 命名空间：`common`（默认）、`auth`、`layout`、`home`
- 从 `@/shared/i18n` 导入

### 样式

**使用 `cn()` 工具函数：**
```typescript
import { cn } from '@/shared/lib'

<div className={cn('base-class', isActive && 'active-class')} />
```

**使用 CSS 变量，禁止硬编码颜色：**
```typescript
// ✅ 正确
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border-border"

// ❌ 错误
className="bg-[#05C79A]"
style={{ color: '#05C79A' }}
```

### 图标和通知

**统一使用：**
- 图标：`lucide-react`
- Toast：`sonner`

```typescript
import { Home, Settings, User } from 'lucide-react'
import { toast } from 'sonner'

<Home className="h-5 w-5" />
toast.success('操作成功')
toast.error('操作失败')
```

### Git 提交规范

**遵循 Conventional Commits 格式：**

```
<type>: <subject>
```

**类型：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `build`: 构建系统
- `ci`: CI 配置
- `chore`: 其他变更

**示例：**
```
feat: add user login feature
fix: fix sidebar collapse issue
docs: update development guidelines
```

## 关键规则总结

1. ✅ 使用 `@/` 路径别名
2. ✅ 从 feature 的 `index.ts` 导入
3. ✅ 使用 `cn()` 处理类名
4. ✅ 使用 TypeScript 类型
5. ✅ 始终使用 i18n
6. ✅ 使用 `useRequest` 进行数据请求
7. ✅ 使用 ROUTES 常量
8. ✅ 使用 toast (sonner)
9. ✅ 使用 lucide-react 图标
10. ✅ 遵循 FSD 架构

## 详细规范文档

### 核心规范文档

- **[全局开发规范](./global.md)** - 技术栈、目录结构、命名规范、状态管理
- **[UI 组件规范](./ui.md)** - Toast、主题、图标、表单、样式
- **[路由规范](./routing.md)** - 路由配置、路由保护、懒加载
- **[API 规范](./api.md)** - HTTP 客户端、错误处理、useRequest
- **[Hooks 规范](./hooks.md)** - ahooks 使用规范
- **[国际化规范](./i18n.md)** - react-i18next 使用规范
- **[Git 提交规范](./git.md)** - Commit message 格式
- **[useRequest 使用指南](./useRequest-guide.md)** - useRequest 详细指南

### 工作流文档

- **[添加新页面](../workflows/add-page.md)** - 页面组件创建、路由配置
- **[添加新功能模块](../workflows/add-feature.md)** - Feature 目录结构
- **[添加新 Hook](../workflows/add-hook.md)** - Hooks 创建规范
- **[添加新 Provider](../workflows/add-provider.md)** - Provider 组织
- **[国际化工作流](../workflows/add-i18n.md)** - 国际化添加流程
- **[useRequest 最佳实践](../workflows/use-request-best-practices.md)** - useRequest 使用规范
