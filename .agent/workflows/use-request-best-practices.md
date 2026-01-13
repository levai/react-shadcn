---
description: useRequest 最佳实践
---

# useRequest 最佳实践

## 核心原则

**在 React 组件中，统一使用 `useRequest` 进行数据请求。**

## 为什么统一使用 useRequest？

### 优势对比

| 特性 | 使用 useRequest | 直接调用 |
|------|----------------|---------|
| **代码量** | 少（自动管理状态） | 多（手动管理） |
| **状态管理** | 自动（loading、error） | 手动（useState） |
| **缓存** | ✅ 内置 | ❌ 需自己实现 |
| **重试** | ✅ 内置 | ❌ 需自己实现 |
| **轮询** | ✅ 内置 | ❌ 需自己实现 |
| **类型推断** | ✅ 完整 | ⚠️ 部分 |
| **代码一致性** | ✅ 统一模式 | ❌ 可能不一致 |

### 代码对比

#### ❌ 不推荐：手动管理状态

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    userService.getUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error.message}</div>
  if (!user) return null

  return <div>{user.name}</div>
}
```

**问题：**
- 代码冗长（20+ 行）
- 需要手动管理多个状态
- 没有缓存、重试等功能
- 容易遗漏错误处理

#### ✅ 推荐：使用 useRequest

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useRequest(
    () => userService.getUser(userId),
    {
      refreshDeps: [userId],
      cacheKey: `user-${userId}`,
      retryCount: 3,
    }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error.message}</div>
  if (!user) return null

  return <div>{user.name}</div>
}
```

**优势：**
- 代码简洁（10 行）
- 自动管理状态
- 内置缓存、重试
- 类型安全

## 使用场景

### 场景一：自动请求（页面加载时）

```typescript
function UserDetail({ userId }: { userId: string }) {
  const { data: user, loading } = useRequest(
    () => userService.getUser(userId),
    {
      refreshDeps: [userId],  // userId 变化时自动刷新
      cacheKey: `user-${userId}`,  // 缓存
    }
  )

  if (loading) return <div>加载中...</div>
  return <div>{user.name}</div>
}
```

### 场景二：手动触发（表单提交）

```typescript
function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const { run: handleLogin, loading } = useRequest(
    (data) => authService.login(data),
    {
      manual: true,  // 手动触发
      onSuccess: (response) => {
        login(response.user, response.token)
        navigate(ROUTES.HOME)
        toast.success('登录成功')
      },
      onError: (error) => {
        toast.error('登录失败')
      },
    }
  )

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data)  // 手动触发
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </Button>
    </form>
  )
}
```

### 场景三：搜索（防抖）

```typescript
function SearchPage() {
  const [keyword, setKeyword] = useState('')

  const { data: results, loading } = useRequest(
    () => searchService.search(keyword),
    {
      debounceWait: 300,  // 防抖 300ms
      refreshDeps: [keyword],  // keyword 变化时刷新
      ready: keyword.length > 0,  // 只有 keyword 有值时才请求
    }
  )

  return (
    <div>
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索..."
      />
      {loading && <div>搜索中...</div>}
      {results && <ResultList results={results} />}
    </div>
  )
}
```

### 场景四：轮询（实时数据）

```typescript
function StatusMonitor({ taskId }: { taskId: string }) {
  const { data: status } = useRequest(
    () => taskService.getStatus(taskId),
    {
      pollingInterval: 2000,  // 每 2 秒轮询
      pollingWhenHidden: false,  // 页面隐藏时停止
      ready: !!taskId,  // 只有 taskId 存在时才轮询
    }
  )

  return <div>状态：{status?.status}</div>
}
```

## 何时直接调用服务函数？

**仅在以下场景直接调用：**

### 1. 非 React 组件中

```typescript
// ✅ Store 中
export const useAppStore = create((set) => ({
  init: async () => {
    try {
      const user = await authService.getCurrentUser()
      set({ user })
    } catch {
      // 处理错误
    }
  },
}))

// ✅ 工具函数中
async function exportData() {
  const data = await dataService.export()
  downloadFile(data)
}
```

### 2. 需要立即执行的场景

```typescript
// ✅ 事件处理器中（非组件）
window.addEventListener('beforeunload', async () => {
  await analyticsService.track('page_unload')
})
```

## 最佳实践清单

- [ ] **组件中统一使用 useRequest** - 保持代码一致性
- [ ] **合理使用缓存** - 根据数据更新频率设置 cacheKey
- [ ] **使用 refreshDeps** - 依赖变化时自动刷新
- [ ] **错误处理** - 在 onError 中处理业务错误
- [ ] **类型安全** - 服务层定义好类型，useRequest 自动推断
- [ ] **避免混用** - 不要在同一组件中混用 useRequest 和直接调用

## 迁移指南

### 步骤 1：识别需要迁移的代码

查找以下模式：
- `useState` + `useEffect` + `try-catch`
- 手动管理 `loading` 状态
- 手动处理错误

### 步骤 2：逐步迁移

1. 先迁移简单的 GET 请求
2. 再迁移表单提交等复杂场景
3. 最后优化缓存、重试等配置

### 步骤 3：验证

- 确保功能正常
- 检查类型推断
- 验证错误处理

## 常见问题

### Q: useRequest 会增加包体积吗？

A: 不会。ahooks 支持 tree-shaking，只打包使用的 hooks。

### Q: 可以直接在 useRequest 中使用 axios 吗？

A: 可以，但推荐使用服务层封装，保持架构清晰。

### Q: useRequest 会影响性能吗？

A: 不会，反而会提升性能（缓存、去重等优化）。

### Q: 什么时候不使用 useRequest？

A: 仅在非组件场景（Store、工具函数）中直接调用。
