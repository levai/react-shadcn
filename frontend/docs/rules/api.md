# API 开发规范

## 服务层架构

每个 Feature 的 API 放在 `features/[name]/api/` 目录：

```
features/auth/api/
├── auth.service.ts   # 服务对象
└── index.ts          # 统一导出
```

## HTTP 客户端

位置：`@/shared/http/client.ts`

**特点：**

- 统一 axios 实例（`RequestClient` 类）
- 自动添加 Token
- 401 自动跳转登录
- 响应拦截器返回 `response.data`
- 支持请求取消（AbortController）
- 支持动态添加/移除拦截器
- 统一的错误处理（`HttpError` 类型）

## 服务对象格式

```typescript
import { clientHttp } from '@/shared/http'

/** API 端点 */
const API = {
  LOGIN: '/v1/auth/login',
  LOGOUT: '/v1/auth/logout',
  CURRENT_USER: '/v1/users/me',
} as const

/** 类型定义 */
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
}

/** 服务对象 */
const authService = {
  /** 登录 */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return clientHttp.post<LoginResponse, LoginRequest>(API.LOGIN, data)
  },

  /** 登出 */
  logout: async (): Promise<void> => {
    return clientHttp.post<void>(API.LOGOUT)
  },

  /** 获取当前用户 */
  getCurrentUser: async (): Promise<User> => {
    return clientHttp.get<User>(API.CURRENT_USER)
  },
}

export default authService
```

## 统一导出

```typescript
// features/auth/api/index.ts
export { default as authService } from './auth.service'
export type { LoginRequest, LoginResponse } from './auth.service'
```

## 使用方式

### ⭐ 推荐：统一使用 useRequest（组件中）

**在 React 组件中，统一使用 `useRequest` 进行数据请求。**

#### 优势

- ✅ **自动管理状态** - loading、error 状态自动管理，无需手动维护
- ✅ **代码简洁** - 减少样板代码（try-catch、setLoading 等）
- ✅ **功能强大** - 缓存、重试、轮询、防抖等开箱即用
- ✅ **类型安全** - 完整的 TypeScript 类型推断
- ✅ **统一体验** - 所有请求使用相同模式，代码更一致

#### 基础用法

```typescript
import { useRequest } from '@/shared/hooks'
import { authService } from '@/features/auth'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useRequest(
    () => authService.getUser(userId),
    {
      cacheKey: `user-${userId}`,  // 缓存
      refreshDeps: [userId],       // 依赖刷新
    }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>

  return <div>{user.name}</div>
}
```

#### 手动触发（表单提交等）

```typescript
import { useRequest } from '@/shared/hooks'
import { authService } from '@/features/auth'

function LoginForm() {
  const { run: login, loading } = useRequest(
    (data) => authService.login(data),
    {
      manual: true,  // 手动触发
      onSuccess: (response) => {
        // 登录成功处理
        toast.success('登录成功')
        navigate(ROUTES.HOME)
      },
      onError: (error) => {
        // 登录失败处理
        toast.error('登录失败')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(formData)  // 手动触发请求
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </Button>
    </form>
  )
}
```

### 直接调用（非组件场景）

**仅在以下场景直接调用服务函数：**

1. **非 React 组件中** - Store、工具函数、事件处理器等
2. **需要立即执行** - 不依赖组件生命周期的场景
3. **简单的一次性请求** - 不需要状态管理的场景

```typescript
// ✅ 正确：在 Store 中直接调用
import { authService } from '@/features/auth'

export const useAuthStore = create(set => ({
  init: async () => {
    try {
      const user = await authService.getCurrentUser()
      set({ user })
    } catch {
      // 处理错误
    }
  },
}))

// ✅ 正确：在工具函数中直接调用
async function exportData() {
  const data = await dataService.export()
  // 处理导出
}
```

### 对比示例

#### ❌ 不推荐：手动管理状态

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    authService
      .getUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  // ... 大量样板代码
}
```

#### ✅ 推荐：使用 useRequest

```typescript
function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    loading,
    error,
  } = useRequest(() => authService.getUser(userId), { refreshDeps: [userId] })

  // 简洁明了
}
```

## HTTP 客户端方法

### RESTful 方法

```typescript
import { clientHttp } from '@/shared/http'

// GET 请求
const user = await clientHttp.get<User>('/users/1')

// POST 请求
const result = await clientHttp.post<LoginResponse, LoginRequest>('/auth/login', data)

// PUT 请求
await clientHttp.put<User, UpdateUserRequest>('/users/1', data)

// PATCH 请求
await clientHttp.patch<User, Partial<UpdateUserRequest>>('/users/1', data)

// DELETE 请求
await clientHttp.delete('/users/1')
```

### 请求取消

```typescript
import { clientHttp } from '@/shared/http'

// 创建 AbortController
const controller = clientHttp.createAbortController()

// 发起请求，传入 signal
const promise = clientHttp.get<User>('/users/1', {
  signal: controller.signal,
})

// 取消请求
controller.abort()
```

### 动态拦截器管理

```typescript
import { clientHttp } from '@/shared/http'

// 添加请求拦截器
const requestId = clientHttp.addRequestInterceptor(config => {
  // 使用 AxiosHeaders 的 set 方法（Axios 1.x 推荐方式）
  config.headers.set('X-Custom-Header', 'value')
  return config
})

// 添加响应拦截器
const responseId = clientHttp.addResponseInterceptor(
  response => response,
  error => Promise.reject(error)
)

// 移除拦截器
clientHttp.removeRequestInterceptor(requestId)
clientHttp.removeResponseInterceptor(responseId)
```

### 自定义配置

```typescript
import { clientHttp } from '@/shared/http'

// 跳过自动添加 Token（公开 API）
const publicData = await clientHttp.get('/public/data', {
  skipAuth: true,
})

// 跳过统一错误处理（自定义处理）
const data = await clientHttp.get('/api/data', {
  skipErrorHandler: true,
})

// 请求取消（signal 已包含在 AxiosRequestConfig 中）
const controller = new AbortController()
const promise = clientHttp.get('/api/data', {
  signal: controller.signal,
})
controller.abort() // 取消请求
```

### RequestConfig 类型说明

`RequestConfig` 扩展了 `AxiosRequestConfig`，添加了以下自定义属性：

```typescript
interface RequestConfig extends AxiosRequestConfig {
  /** 是否跳过自动添加 Token（默认 false） */
  skipAuth?: boolean
  /** 是否跳过统一错误处理（默认 false） */
  skipErrorHandler?: boolean
  // signal 属性已包含在 AxiosRequestConfig 中，无需重复定义
}
```

**注意：**

- `signal` 属性已包含在 `AxiosRequestConfig` 中，可直接使用
- 所有 `AxiosRequestConfig` 的属性都可以在 `RequestConfig` 中使用
- 在拦截器中设置 headers 时，使用 `config.headers.set()` 方法（Axios 1.x 推荐方式）

## 关键规范

1. **组件中统一使用 useRequest** - 自动管理状态，代码更简洁
2. **非组件场景直接调用** - Store、工具函数等场景直接调用服务函数
3. **使用 `clientHttp` 实例** - 不要直接使用 axios
4. **使用 RESTful 方法** - 优先使用 `get`, `post`, `put`, `patch`, `delete` 方法
5. **API 端点用常量定义** - 使用 `as const`
6. **必须定义请求/响应类型** - 保证类型安全
7. **服务对象使用默认导出** - 保持一致性
8. **错误处理** - 在 useRequest 的 onError 中处理业务错误，或使用 `HttpError` 类型

## 迁移建议

如果现有代码使用直接调用方式，建议逐步迁移到 useRequest：

### 迁移前

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    authService.getUser(userId)
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>加载中...</div>
  return <div>{user?.name}</div>
}
```

### 迁移后

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading } = useRequest(
    () => authService.getUser(userId),
    { refreshDeps: [userId] }
  )

  if (loading) return <div>加载中...</div>
  return <div>{user?.name}</div>
}
```

**优势：**

- 代码减少 50%+
- 自动处理错误
- 支持缓存、重试等功能
- 更好的类型推断
