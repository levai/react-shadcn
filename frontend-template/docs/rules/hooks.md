# Hooks 使用规范

> 📊 **详细对比请参考：[Hooks 库全面对比](./hooks-comparison.md)**

## 使用的 Hooks 库：ahooks

项目使用 **ahooks** 作为主要 Hooks 库。

### 为什么选择 ahooks？

- ✅ **国内团队开发** - 阿里开源，中文文档完善，社区活跃
- ✅ **功能强大** - 70+ hooks，覆盖常见业务场景
- ✅ **性能优化** - `useRequest` 支持缓存、去重、轮询等高级功能
- ✅ **企业级** - 经过大量生产环境验证
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **Tree-shakable** - 支持按需引入

### 安装

```bash
npm install ahooks
# 或
pnpm add ahooks
# 或
yarn add ahooks
```

### 官方文档

- **中文文档**：https://ahooks.js.org/zh-CN
- **GitHub**：https://github.com/alibaba/hooks
- **所有 Hooks 列表**：https://ahooks.js.org/zh-CN/hooks/index

## 使用方式

### 统一导出

所有 hooks 通过 `@/shared/hooks` 统一导出，保持 API 一致性：

```typescript
// src/shared/hooks/index.ts
// 从 ahooks 导出常用 hooks
export {
  useDebounce,
  useThrottle,
  useLocalStorageState,
  useSessionStorageState,
  useToggle,
  usePrevious,
  useClickAway,
  useSize,
  useRequest,
  useVirtualList,
  useInfiniteScroll,
  usePagination,
} from 'ahooks'

// 自定义 hooks（ahooks 中没有的）
export { useMediaQuery } from './useMediaQuery'
```

### 导入规则

```typescript
// ✅ 正确：从 @/shared/hooks 导入
import { 
  useDebounce, 
  useLocalStorageState, 
  useRequest,
  useMediaQuery 
} from '@/shared/hooks'

// ❌ 错误：不要直接从 ahooks 导入
import { useDebounce } from 'ahooks'
```

## 已导出的常用 Hooks

| Hook | 用途 | 示例 |
|------|------|------|
| **useRequest** | 数据请求（缓存、重试、轮询） | `const { data, loading } = useRequest(fetchData)` |
| **useDebounce** | 防抖 | `const debounced = useDebounce(value, 300)` |
| **useThrottle** | 节流 | `const throttled = useThrottle(value, 300)` |
| **useLocalStorageState** | localStorage | `const [value, setValue] = useLocalStorageState('key', { defaultValue: 'init' })` |
| **useSessionStorageState** | sessionStorage | `const [value, setValue] = useSessionStorageState('key', { defaultValue: 'init' })` |
| **useToggle** | 布尔切换 | `const [isOpen, toggle] = useToggle(false)` |
| **usePrevious** | 上一次值 | `const prev = usePrevious(value)` |
| **useClickAway** | 点击外部 | `useClickAway(ref, () => setIsOpen(false))` |
| **useSize** | 元素尺寸 | `const size = useSize(ref)` |
| **useVirtualList** | 虚拟列表 | `const { list } = useVirtualList(data, options)` |
| **useInfiniteScroll** | 无限滚动 | `const { data, loadMore } = useInfiniteScroll(fetchData)` |
| **usePagination** | 分页管理 | `const { current, pageSize, total } = usePagination()` |
| **useMediaQuery** | 媒体查询（自定义） | `const isDesktop = useMediaQuery('(min-width: 1024px)')` |

### 更多 Hooks

ahooks 提供了 70+ hooks，更多 hooks 请查看：
- [ahooks 官方文档](https://ahooks.js.org/zh-CN/hooks/index)
- [useRequest 详细文档](https://ahooks.js.org/zh-CN/hooks/use-request)

## 核心功能示例

### useRequest - 强大的数据请求 Hook

`useRequest` 是 ahooks 的核心功能，提供了企业级的数据请求能力。

#### 与 Axios 拦截器配合使用

**重要说明：** `useRequest` 本身不提供拦截器功能，但它可以与已经配置了拦截器的 axios 实例完美配合使用。

**最佳实践：**
1. **在 axios 层面配置拦截器**（全局处理 Token、错误等）
2. **在服务层封装 API 调用**（使用配置好的 axios 实例）
3. **在组件中使用 useRequest**（调用服务层函数，享受缓存、重试等功能）

```typescript
// ✅ 正确：使用已配置拦截器的服务函数
import { useRequest } from '@/shared/hooks'
import { authService } from '@/features/auth'

// useRequest 会自动使用 axios 拦截器
const { data, loading, error } = useRequest(() => authService.getCurrentUser(), {
  cacheKey: 'current-user',
  retryCount: 3,
})
```

#### 基础用法

```typescript
import { useRequest } from '@/shared/hooks'
import { authService } from '@/features/auth'

// 基础用法
const { data, loading, error } = useRequest(() => authService.getCurrentUser())
```

#### 高级功能

```typescript
import { useRequest } from '@/shared/hooks'
import { authService } from '@/features/auth'

// 高级功能：缓存、去重、轮询、重试
const { data, loading, refresh } = useRequest(
  () => authService.getCurrentUser(),
  {
    cacheKey: 'current-user',        // 缓存
    refreshDeps: [userId],           // 依赖刷新
    pollingInterval: 3000,          // 轮询（3秒）
    debounceWait: 300,               // 防抖（300ms）
    retryCount: 3,                   // 重试（3次）
    onSuccess: (data) => {           // 成功回调
      console.log('获取成功', data)
    },
    onError: (error) => {            // 失败回调
      console.error('获取失败', error)
    },
  }
)
```

#### 为什么这样设计？

- **职责分离**：拦截器处理全局逻辑（Token、错误处理），useRequest 处理请求级逻辑（缓存、重试）
- **复用性**：同一个服务函数可以在 useRequest 中使用，也可以直接调用
- **灵活性**：可以根据不同场景选择是否使用 useRequest 的高级功能

### 完整使用示例

```typescript
import { 
  useRequest, 
  useDebounce, 
  useLocalStorageState,
  useMediaQuery,
  useToggle 
} from '@/shared/hooks'
import { useState } from 'react'

function UserProfile({ userId }: { userId: string }) {
  // 数据请求（带缓存和重试）
  const { data: user, loading, error } = useRequest(
    () => fetchUser(userId),
    {
      cacheKey: `user-${userId}`,
      refreshDeps: [userId],
      retryCount: 3,
    }
  )

  // 防抖搜索
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  // 本地存储
  const [theme, setTheme] = useLocalStorageState('theme', { defaultValue: 'light' })

  // 媒体查询
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // 布尔切换
  const [isOpen, toggle] = useToggle(false)

  return (
    <div>
      {loading ? '加载中...' : <UserInfo user={user} />}
    </div>
  )
}
```

## 使用建议

### ⭐ 推荐：组件中统一使用 useRequest

**在 React 组件中进行数据请求时，统一使用 `useRequest`。**

**优势：**
- ✅ 自动管理 loading、error 状态
- ✅ 减少样板代码（无需 try-catch、setLoading）
- ✅ 内置缓存、重试、轮询等功能
- ✅ 代码更简洁、一致

**示例：**

```typescript
// ✅ 推荐：使用 useRequest
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useRequest(
    () => userService.getUser(userId),
    { refreshDeps: [userId] }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>
  return <div>{user.name}</div>
}

// ❌ 不推荐：手动管理状态
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userService.getUser(userId)
      .then(setUser)
      .finally(() => setLoading(false))
  }, [userId])

  // 大量样板代码...
}
```

**详细指南：** [useRequest 与 Axios 拦截器配合使用指南](./useRequest-guide.md)

## 添加新 Hook

### 从 ahooks 添加

如果需要使用 ahooks 中的其他 hooks，在 `src/shared/hooks/index.ts` 中添加导出：

```typescript
// src/shared/hooks/index.ts
export {
  // ... 现有 hooks
  useNewHook,  // 新增的 hook
} from 'ahooks'
```

然后就可以从 `@/shared/hooks` 导入使用了：

```typescript
import { useNewHook } from '@/shared/hooks'
```

### 创建自定义 Hook

如果 ahooks 中没有需要的功能，可以创建自定义 hook：

1. 在 `src/shared/hooks/` 下创建文件：`useCustomHook.ts`
2. 在 `src/shared/hooks/index.ts` 中导出
3. 从 `@/shared/hooks` 导入使用

详细规范请参考：[添加新 Hook 工作流](../../.agent/workflows/add-hook.md)

## 注意事项

### 1. Tree-shaking

确保使用具名导入，不要使用 `import *`：

```typescript
// ✅ 正确
import { useDebounce, useRequest } from '@/shared/hooks'

// ❌ 错误
import * as hooks from '@/shared/hooks'
```

### 2. 类型安全

ahooks 提供完整的 TypeScript 类型定义，无需额外安装 `@types/ahooks`。

### 3. SSR 兼容

ahooks 已处理 SSR 兼容性，可以在 Next.js 等 SSR 框架中使用。

### 4. 性能优化

- 按需导入，只打包使用的 hooks
- `useRequest` 内置缓存、去重等性能优化
- 使用 `useVirtualList` 处理大数据列表

### 5. 最佳实践

- **统一导入**：始终从 `@/shared/hooks` 导入，不要直接从 `ahooks` 导入
- **合理使用**：根据场景选择合适的 hook，不要过度使用
- **查看文档**：使用前查看官方文档，了解所有选项和最佳实践

## useRequest 与 Axios 拦截器

**重要说明：** `useRequest` 本身不提供拦截器功能，但可以与已配置拦截器的 axios 完美配合。

**工作原理：**
- Axios 拦截器处理全局逻辑（Token、错误处理等）
- useRequest 处理请求级逻辑（缓存、重试、轮询等）

**使用方式：**
```typescript
// 服务层使用配置好的 axios（已包含拦截器）
const userService = {
  getUser: async (id: string) => request(`/users/${id}`)
}

// 组件中使用 useRequest（自动使用拦截器）
const { data } = useRequest(() => userService.getUser(id))
```

**详细指南：** [useRequest 与 Axios 拦截器配合使用指南](./useRequest-guide.md)

## 相关文档

- [useRequest 与 Axios 拦截器指南](./useRequest-guide.md) - useRequest 详细使用指南
- [Hooks 库全面对比](./hooks-comparison.md) - 主流 Hooks 库详细对比
- [添加新 Hook 工作流](../../.agent/workflows/add-hook.md) - 如何添加自定义 Hook
- [API 开发规范](./api.md) - API 服务层规范
- [全局开发规范](./global.md) - Hooks 使用规范章节
