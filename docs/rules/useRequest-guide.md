# useRequest 与 Axios 拦截器配合使用指南

## 核心概念

**useRequest 不提供拦截器功能，但可以与已配置拦截器的 axios 完美配合。**

### 架构设计

```
┌─────────────────────────────────────────┐
│  Axios 拦截器（全局）                    │
│  - 请求拦截：添加 Token                  │
│  - 响应拦截：统一错误处理                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  服务层（Service）                       │
│  - 封装 API 调用                         │
│  - 使用配置好的 axios 实例               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  useRequest（组件层）                    │
│  - 缓存、重试、轮询                      │
│  - 自动管理 loading 状态                 │
└─────────────────────────────────────────┘
```

## 完整示例

### 1. Axios 配置（已有）

```typescript
// src/shared/api/client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
})

// 请求拦截器 - 自动添加 Token
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理 401
    }
    return Promise.reject(error)
  }
)
```

### 2. 服务层封装

```typescript
// src/features/user/api/user.service.ts
import { request } from '@/shared/api'

const API = {
  GET_USER: (id: string) => `/v1/users/${id}`,
} as const

const userService = {
  getUser: async (id: string): Promise<User> => {
    return request<User>(API.GET_USER(id))
  },
}

export default userService
```

### 3. 组件中使用 useRequest

```typescript
// src/pages/UserPage/UserPage.tsx
import { useRequest } from '@/shared/hooks'
import { userService } from '@/features/user'

function UserPage({ userId }: { userId: string }) {
  // useRequest 会自动使用 axios 拦截器
  const { data: user, loading, error, refresh } = useRequest(
    () => userService.getUser(userId),
    {
      cacheKey: `user-${userId}`,  // 缓存
      refreshDeps: [userId],       // 依赖刷新
      retryCount: 3,               // 重试
      onSuccess: (data) => {
        console.log('获取成功', data)
      },
    }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refresh}>刷新</button>
    </div>
  )
}
```

## 常见场景

### 场景一：带参数的请求

```typescript
const { data, loading } = useRequest(
  (params) => userService.searchUsers(params),
  {
    manual: true,  // 手动触发
  }
)

// 触发请求
data({ keyword: 'test', page: 1 })
```

### 场景二：POST 请求

```typescript
const { run: createUser, loading } = useRequest(
  (data) => userService.createUser(data),
  {
    manual: true,
    onSuccess: () => {
      toast.success('创建成功')
    },
  }
)

// 触发请求
createUser({ name: 'John', email: 'john@example.com' })
```

### 场景三：轮询

```typescript
const { data } = useRequest(
  () => userService.getStatus(userId),
  {
    pollingInterval: 3000,  // 每 3 秒轮询一次
    pollingWhenHidden: false,  // 页面隐藏时停止轮询
  }
)
```

### 场景四：防抖请求

```typescript
const [keyword, setKeyword] = useState('')

const { data } = useRequest(
  () => userService.search(keyword),
  {
    debounceWait: 300,  // 防抖 300ms
    refreshDeps: [keyword],  // keyword 变化时刷新
  }
)
```

## 优势总结

### ✅ 使用 useRequest 的优势

1. **自动使用拦截器** - 无需额外配置，自动享受 Token、错误处理等
2. **内置缓存** - 相同请求自动缓存，减少网络请求
3. **自动重试** - 请求失败自动重试
4. **状态管理** - 自动管理 loading、error 状态
5. **轮询支持** - 轻松实现数据轮询
6. **防抖节流** - 内置防抖和节流功能

### ❌ 不使用 useRequest 的情况

**仅在以下场景直接调用服务函数：**

1. **非 React 组件中** - Store、工具函数、事件处理器等
2. **需要立即执行** - 不依赖组件生命周期的场景
3. **简单的一次性请求** - 不需要状态管理的场景

```typescript
// ✅ 正确：在 Store 中直接调用
export const useAppStore = create((set) => ({
  init: async () => {
    const user = await authService.getCurrentUser()
    set({ user })
  },
}))

// ✅ 正确：在工具函数中直接调用
async function exportData() {
  const data = await dataService.export()
  downloadFile(data)
}
```

## 最佳实践

### ⭐ 推荐：组件中统一使用 useRequest

**在 React 组件中，统一使用 `useRequest` 进行数据请求。**

**理由：**
1. **代码一致性** - 所有组件使用相同模式
2. **减少样板代码** - 无需手动管理 loading、error 状态
3. **功能强大** - 缓存、重试等功能开箱即用
4. **更好的 DX** - 开发体验更好

### 实践建议

1. **保持拦截器在 axios 层面** - 处理全局逻辑（Token、错误处理）
2. **服务层封装 API** - 使用配置好的 axios 实例
3. **组件中统一使用 useRequest** - 享受高级功能
4. **合理使用缓存** - 根据数据更新频率设置 cacheKey
5. **错误处理** - 在 onError 中处理业务错误，axios 拦截器处理全局错误
6. **保持一致性** - 团队统一使用 useRequest，避免混用

## 注意事项

1. **拦截器是全局的** - 所有通过 `request` 函数的请求都会经过拦截器
2. **useRequest 是请求级的** - 每个 useRequest 可以有不同的配置
3. **类型安全** - 服务层定义好类型，useRequest 会自动推断
4. **统一使用 useRequest** - 在组件中统一使用 useRequest，保持代码一致性
5. **非组件场景直接调用** - Store、工具函数等场景可以直接调用服务函数

## 总结

### ✅ 推荐做法

- **组件中**：统一使用 `useRequest`
- **非组件中**：直接调用服务函数

### ❌ 不推荐做法

- 组件中混用 useRequest 和直接调用
- 在组件中手动管理 loading、error 状态
- 不使用 useRequest 的高级功能（缓存、重试等）
