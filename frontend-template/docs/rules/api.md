# API 开发规范

## 服务层架构

每个 Feature 的 API 放在 `features/[name]/api/` 目录：

```
features/auth/api/
├── auth.service.ts   # 服务对象
└── index.ts          # 统一导出
```

## HTTP 客户端

位置：`@/shared/api/client.ts`

**特点：**

- 统一 axios 实例
- 自动添加 Token
- 401 自动跳转登录
- 响应拦截器返回 `response.data`

## 服务对象格式

```typescript
import { request } from '@/shared/api'

/** API 端点 */
const API = {
  LOGIN: '/v1/auth/login',
  LOGOUT: '/v1/auth/logout',
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
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(API.LOGIN, {
      method: 'POST',
      data,
    })
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

```typescript
import { authService } from '@/features/auth'

try {
  const response = await authService.login(data)
  // 处理成功
} catch (error) {
  // 处理错误
}
```

## 关键规范

1. **使用 `request` 函数**，不要直接使用 axios
2. **API 端点用常量定义**，使用 `as const`
3. **必须定义请求/响应类型**
4. **服务对象使用默认导出**
5. **错误在组件中处理**，服务层只负责调用
