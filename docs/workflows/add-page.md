---
description: 添加新页面工作流
---

# 添加新页面

## 步骤

### 1. 创建页面目录和组件

在 `src/pages/` 下创建新目录：

```
src/pages/[PageName]/
├── [PageName].tsx    # 页面组件
└── index.ts          # 导出
```

### 2. 页面组件模板

```typescript
// src/pages/ExamplePage/ExamplePage.tsx

/**
 * 示例页面
 */
const ExamplePage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold'>页面标题</h1>
        {/* 页面内容 */}
      </div>
    </div>
  )
}

export default ExamplePage
```

### 3. 导出文件

```typescript
// src/pages/ExamplePage/index.ts
export { default } from './ExamplePage'
```

### 4. 添加路由常量

在 `src/shared/constants/routes.ts` 添加：

```typescript
export const ROUTES = {
  // ... 现有路由
  EXAMPLE: '/example',
} as const
```

### 5. 注册路由

在 `src/routes/AppRouter.tsx` 添加：

```typescript
const ExamplePage = lazy(() => import('@/pages/ExamplePage'))

// 在 Routes 中添加
<Route
  path={ROUTES.EXAMPLE}
  element={
    <ProtectedRoute>
      <ExamplePage />
    </ProtectedRoute>
  }
/>
```

## 注意事项

- 页面组件使用**箭头函数 + 默认导出**
- 目录名和文件名必须**完全一致**
- 需要认证的页面用 `ProtectedRoute` 包裹
- 使用 `lazy()` 实现代码分割
