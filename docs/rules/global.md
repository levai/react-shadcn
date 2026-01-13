# 全局开发规范

## 技术栈

- **React**: 19.x
- **TypeScript**: 5.9.x
- **Vite**: 7.x
- **Tailwind CSS**: 4.x
- **Zustand**: 5.x（状态管理）
- **React Router**: 7.x
- **Axios**: HTTP 客户端
- **react-i18next**: 国际化（i18n）

## 目录结构 (Feature-Sliced Design)

```text
src/
├── app/              # 应用层：入口、Provider、全局配置
│   ├── App.tsx       # 根组件
│   ├── main.tsx      # 入口文件
│   ├── globals.css   # 全局样式
│   ├── providers/    # 全局 Provider 组件
│   │   ├── ErrorBoundaryProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ToasterProvider.tsx
│   │   └── index.tsx  # 统一导出和组合
│   └── layouts/       # 全局布局组件
├── features/         # 功能层：按业务功能拆分
│   └── [feature]/
│       ├── ui/       # 该功能的 UI 组件
│       ├── api/      # 该功能的 API 服务
│       ├── model/    # 该功能的状态管理 (Zustand)
│       ├── types/    # 该功能的类型定义
│       └── index.ts  # 统一导出（公共 API）
├── pages/            # 页面层：路由入口组件
│   └── [PageName]/
│       ├── [PageName].tsx
│       └── index.ts
├── shared/           # 共享层：跨功能复用的代码
│   ├── ui/           # 基础 UI 组件
│   ├── lib/          # 工具函数 (cn 等)
│   ├── hooks/        # 共享 Hooks (useDebounce, useMediaQuery 等)
│   ├── i18n/         # 国际化配置和语言资源
│   ├── api/          # HTTP 客户端
│   ├── types/        # 通用类型定义
│   ├── config/       # 应用配置
│   └── constants/    # 常量定义
└── routes/           # 路由配置
```

## 路径别名

统一使用 `@/` 前缀：

```typescript
// ✅ 正确
import { LoginForm } from '@/features/auth'
import { cn } from '@/shared/lib'

// ❌ 错误
import { LoginForm } from '../../features/auth'
```

## 导入规则

1. **从 feature 的 index.ts 导入**，不要导入内部文件
2. **使用具名导入**，避免 `import *`
3. **共享 Hooks 从 `@/shared/hooks` 导入**

```typescript
// ✅ 正确 - Feature 导入
import { LoginForm, useAuthStore, authService } from '@/features/auth'

// ✅ 正确 - 共享 Hooks 导入
import { useDebounce, useMediaQuery, useLocalStorageState } from '@/shared/hooks'

// ❌ 错误 - 不要直接导入内部文件
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { useDebounce } from '@/shared/hooks/useDebounce'
```

## Hooks 使用规范

### 共享 Hooks

位置：`src/shared/hooks/`

**使用的库：** ahooks（阿里开源，中文文档完善）

### ⭐ 数据请求规范

**在 React 组件中，统一使用 `useRequest` 进行数据请求。**

```typescript
import { useRequest } from '@/shared/hooks'
import { userService } from '@/features/user'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useRequest(
    () => userService.getUser(userId),
    { refreshDeps: [userId] }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>
  return <div>{user.name}</div>
}
```

**优势：**

- ✅ 自动管理 loading、error 状态
- ✅ 内置缓存、重试、轮询等功能
- ✅ 代码更简洁，减少样板代码

**详细指南：** [useRequest 使用指南](./useRequest-guide.md)

### 常用 Hooks

1. **useRequest** - 数据请求（缓存、重试、轮询）

   ```typescript
   const { data, loading } = useRequest(() => userService.getUser(id))
   ```

2. **useDebounce** - 防抖处理

   ```typescript
   const debouncedValue = useDebounce(value, 300)
   ```

3. **useLocalStorageState** - 同步 localStorage

   ```typescript
   const [theme, setTheme] = useLocalStorageState('theme', { defaultValue: 'light' })
   ```

4. **useMediaQuery** - 监听媒体查询变化（自定义）
   ```typescript
   const isDesktop = useMediaQuery('(min-width: 1024px)')
   ```

**更多 hooks 请查看：** [ahooks 官方文档](https://ahooks.js.org/zh-CN)

### 功能特定 Hooks

位置：`src/features/[feature]/hooks/`（可选）

如果只有一个 hook，也可以直接放在 feature 根目录。

**导出方式：**

```typescript
// features/auth/index.ts
export { useAuth } from './hooks'
// 或
export { useAuth } from './useAuth'
```

## 命名规范

| 类型     | 规范                | 示例                      |
| -------- | ------------------- | ------------------------- |
| 组件文件 | PascalCase          | `LoginForm.tsx`           |
| 页面目录 | PascalCase + Page   | `LoginPage/LoginPage.tsx` |
| Hook     | camelCase + use     | `useAuthStore`            |
| 服务     | camelCase + Service | `authService`             |
| 类型     | PascalCase          | `LoginRequest`            |
| 常量     | UPPER_SNAKE_CASE    | `ROUTES`                  |

## 组件定义

### 页面组件

```typescript
// 箭头函数 + 默认导出
const LoginPage = () => {
  return <div>...</div>
}
export default LoginPage
```

### 业务组件

```typescript
// 函数声明 + 命名导出
export function LoginForm({ onSubmit }: Props) {
  return <form>...</form>
}
```

## 主题色规范

### 主题色配置位置

主题色配置在 `src/app/globals.css` 中，通过 CSS 变量定义。

### 主题色值

**深色模式（.dark）：**

- 主色：`#05C79A` (HSL: 165 95% 40%)
- 背景：`#0A0E13` (HSL: 210 30% 7%)
- 表面：`#111827` (HSL: 220 25% 10%)
- 边框：`#2A3B47` (HSL: 200 25% 22%)
- 文本主色：`#E5E7EB` (HSL: 220 10% 91%)
- 文本次色：`#8899A6` (HSL: 210 10% 60%)

**浅色模式（:root）：**

- 主色：`#05C79A` (与深色模式一致)
- 背景：白色
- 文本：深色

### 使用规范

**必须使用 CSS 变量，禁止硬编码颜色：**

```typescript
// ✅ 正确
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border-border"

// ❌ 错误
className="bg-[#05C79A]"
style={{ color: '#05C79A' }}
```

**必须同时支持浅色和深色模式：**

- 所有颜色必须通过 CSS 变量定义
- 确保在两种模式下都有良好的对比度
- 主色在两种模式下保持一致

### 修改主题色

如需修改主题色：

1. 修改 `src/app/globals.css` 中的 CSS 变量
2. 更新深色模式（`.dark`）和浅色模式（`:root`）的配置
3. 确保两种模式下的颜色协调
4. 测试所有使用该颜色的组件

## 状态管理规范

### Store 位置规范

**全局应用状态** - `src/shared/stores/app.store.ts`：

```typescript
// ✅ 应该放在这里的状态：
// - 全局布局相关状态（侧边栏、导航栏等）
// - 用户 UI 偏好设置（侧边栏宽度、折叠状态等）
// - 跨功能的全局 UI 状态

import { useAppStore } from '@/shared/stores'
```

**业务功能状态** - `src/features/[feature]/model/[feature].store.ts`：

```typescript
// ✅ 应该放在这里的状态：
// - 特定业务功能的状态（如认证、用户资料等）
// - 功能相关的数据缓存
// - 功能相关的加载状态

// 目录结构示例：
// features/
//   auth/
//     model/
//       auth.store.ts    ← Store 文件
//       index.ts         ← 导出文件
//     index.ts           ← Feature 统一导出

import { useAuthStore } from '@/features/auth'
```

**目录结构要求：**

```text
features/
└── [feature]/
    ├── model/
    │   ├── [feature].store.ts  # Store 实现
    │   └── index.ts            # 导出 use[Feature]Store
    ├── api/                    # API 服务
    ├── ui/                     # UI 组件
    ├── types/                  # 类型定义（可选）
    │   └── index.ts            # 导出功能相关类型
    └── index.ts                # Feature 统一导出
```

**必须通过 feature 的 index.ts 导出：**

```typescript
// features/auth/index.ts
export { useAuthStore } from './model'
export { authService } from './api'
export { LoginForm } from './ui'
export type { User, LoginRequest, LoginResponse } from './types'
```

### Store 命名规范

| Store 类型   | 命名规范             | 示例           |
| ------------ | -------------------- | -------------- |
| 全局应用状态 | `app.store.ts`       | `useAppStore`  |
| 业务功能状态 | `[feature].store.ts` | `useAuthStore` |
| 导出 Hook    | `use[Name]Store`     | `useAppStore`  |

### Store 使用规范

**必须从统一入口导入：**

```typescript
// ✅ 正确 - 从 shared/stores 导入全局状态
import { useAppStore } from '@/shared/stores'

// ✅ 正确 - 从 feature 的 index.ts 导入功能状态
import { useAuthStore } from '@/features/auth'

// ❌ 错误 - 不要直接导入内部文件
import { useAuthStore } from '@/features/auth/model/auth.store'
```

**必须使用 persist 持久化用户偏好：**

```typescript
// ✅ 正确 - 用户偏好应该持久化
export const useAppStore = create<AppState>()(
  persist(
    set => ({
      /* ... */
    }),
    {
      name: 'app-storage',
      partialize: state => ({
        preferences: state.preferences,
      }),
    }
  )
)
```

### Features Store 规范

**必须放在 `model/` 目录下：**

```typescript
// features/[feature]/model/[feature].store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStorageKey } from '@/shared/config'

const STORAGE_KEY = getStorageKey('[feature]')

interface [Feature]State {
  // 状态定义
}

export const use[Feature]Store = create<[Feature]State>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ /* 需要持久化的字段 */ }),
    }
  )
)
```

**必须通过 model/index.ts 导出：**

```typescript
// features/[feature]/model/index.ts
export { use[Feature]Store } from './[feature].store'
export { STORAGE_KEY } from './[feature].store'
```

**必须通过 feature/index.ts 统一导出：**

```typescript
// features/[feature]/index.ts
export { use[Feature]Store } from './model'
export { [feature]Service } from './api'
export { [Feature]Component } from './ui'
export type { [Feature]Type1, [Feature]Type2 } from './types'
```

### Features 类型定义规范

**功能相关类型应放在 `types/` 目录下：**

```typescript
// features/[feature]/types/index.ts
/**
 * [Feature] Feature - 类型定义
 *
 * 包含该功能相关的所有类型定义
 */

export interface [Feature]Type1 {
  // 类型定义
}

export interface [Feature]Type2 {
  // 类型定义
}
```

**类型使用规范：**

```typescript
// ✅ 正确 - 从 feature 统一导出类型
import type { User, LoginRequest, LoginResponse } from '@/features/auth'

// ✅ 正确 - 在 feature 内部从 types 导入
import type { User } from '../types'

// ❌ 错误 - 不要直接导入内部文件
import type { User } from '@/features/auth/types/index'
```

**类型分类指南：**

| 类型类型     | 存放位置                    | 示例                        |
| ------------ | --------------------------- | --------------------------- |
| 功能相关类型 | `features/[feature]/types/` | `User`, `LoginRequest`      |
| 通用类型     | `shared/types/`             | `ApiResponse`, `PageResult` |

**使用示例：**

```typescript
// ✅ 正确 - 从 feature 统一导出
import { useAuthStore } from '@/features/auth'

// ❌ 错误 - 不要直接导入内部文件
import { useAuthStore } from '@/features/auth/model/auth.store'
```

### 状态分类指南

| 状态类型       | 存放位置                                      | 示例                  |
| -------------- | --------------------------------------------- | --------------------- |
| 侧边栏折叠状态 | `shared/stores/app.store.ts`                  | `sidebarCollapsed`    |
| 用户认证信息   | `features/auth/model/auth.store.ts`           | `user`, `accessToken` |
| 主题模式       | `next-themes` (不在此处)                      | `theme`               |
| 业务数据列表   | `features/[feature]/model/[feature].store.ts` | `products`, `orders`  |
| 全局加载状态   | `shared/stores/app.store.ts`                  | `globalLoading`       |
| 用户偏好设置   | `shared/stores/app.store.ts`                  | `preferences`         |

### Store 命名规范总结

| Store 类型   | 文件命名               | Hook 命名           | 示例                                |
| ------------ | ---------------------- | ------------------- | ----------------------------------- |
| 全局应用状态 | `app.store.ts`         | `useAppStore`       | `shared/stores/app.store.ts`        |
| 业务功能状态 | `[feature].store.ts`   | `use[Feature]Store` | `features/auth/model/auth.store.ts` |
| 存储 Key     | 使用 `getStorageKey()` | -                   | `getStorageKey('auth')`             |

## 代码质量保障

### ESLint 配置

项目使用 **ESLint** 进行代码质量检查。

**关键配置：**

- **React Refresh 规则** - 允许在组件文件中导出 Hooks 和 variants
  - 允许导出：`useFormField`、`buttonVariants`、`badgeVariants` 等
  - 这是为了支持 shadcn/ui 组件的常见模式（组件 + Hook/variants）

**如需添加新的 Hook 或 variants 导出：**

在 `eslint.config.js` 的 `allowExportNames` 数组中添加导出名称。

### Prettier 配置

项目使用 **Prettier** 作为代码格式化工具，确保代码风格统一。

配置文件：`.prettierrc`

**主要配置：**

- `semi: false` - 不使用分号
- `singleQuote: true` - 使用单引号
- `tabWidth: 2` - 缩进 2 个空格
- `printWidth: 100` - 每行最大 100 字符
- `trailingComma: "es5"` - 尾随逗号

### 使用方式

**格式化所有文件：**

```bash
npm run format
# 或
pnpm format
```

**检查格式：**

```bash
npm run format:check
# 或
pnpm format:check
```

### 编辑器集成

**VSCode：**

- 安装 `Prettier - Code formatter` 插件
- 已配置保存时自动格式化
- 已配置为默认格式化工具

**Git Hooks：**

- 提交前自动格式化（通过 lint-staged）
- 确保提交的代码格式统一

### 与 ESLint 集成

项目已配置 `eslint-config-prettier`，确保 Prettier 和 ESLint 不冲突：

- Prettier 负责代码格式化
- ESLint 负责代码质量检查

## Git 提交规范

项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，使用 commitlint 自动检查提交消息格式。

**基本格式：**

```text
<type>: <subject>
```

**提交类型：**

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建相关
- `ci`: CI 配置
- `chore`: 其他变更
- `revert`: 回滚

**示例：**

```text
feat: 添加用户登录功能
fix: 修复侧边栏折叠问题
docs: 更新开发规范文档
```

详细规范请查看：[Git 提交规范](./git.md)
