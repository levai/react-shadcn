# 路由规范

## 路由配置位置

所有路由配置在 `src/routes/AppRouter.tsx`

## 路由常量

位置：`@/shared/constants/routes.ts`

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const
```

**必须使用常量**，禁止硬编码路径：

```typescript
import { ROUTES } from '@/shared/constants'

// ✅ 正确
navigate(ROUTES.HOME)

// ❌ 错误
navigate('/')
```

## 路由保护

需要认证的路由使用 `ProtectedRoute` 包裹：

```typescript
import { ProtectedRoute } from '@/features/auth'

;<Route
  path={ROUTES.DASHBOARD}
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## 懒加载

页面组件必须使用 `lazy()` 懒加载：

```typescript
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
  </Routes>
</Suspense>
```

## 添加新路由步骤

1. **创建页面组件** - `src/pages/NewPage/NewPage.tsx`
2. **添加路由常量** - `src/shared/constants/routes.ts`
3. **注册路由** - `src/routes/AppRouter.tsx`
4. **使用 lazy 懒加载**
5. **按需添加 ProtectedRoute**

## 导航方式

```typescript
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'

const navigate = useNavigate()

// 普通导航
navigate(ROUTES.HOME)

// 替换历史记录
navigate(ROUTES.LOGIN, { replace: true })

// 动态路由
navigate(`/products/${id}`)
```
