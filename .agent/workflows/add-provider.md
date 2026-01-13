---
description: 添加新 Provider 工作流
---

# 添加新 Provider

## 目录结构

所有全局 Provider 统一放在 `src/app/providers/` 目录下：

```
app/
└── providers/
    ├── ErrorBoundaryProvider.tsx
    ├── ThemeProvider.tsx
    ├── ToasterProvider.tsx
    ├── [NewProvider].tsx      # 新 Provider
    └── index.tsx               # 统一导出和组合
```

## 步骤

### 1. 创建 Provider 组件

在 `src/app/providers/` 下创建新的 Provider 文件：

```typescript
// src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * React Query Provider
 * 提供数据获取和缓存功能
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 2. 在 index.tsx 中注册

在 `src/app/providers/index.tsx` 中添加新 Provider：

```typescript
import { ErrorBoundaryProvider } from './ErrorBoundaryProvider'
import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from './QueryProvider'  // 新增
import { ToasterProvider } from './ToasterProvider'
import { AppRouter } from '@/routes'

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundaryProvider>
      <ThemeProvider>
        <QueryProvider>  {/* 新增，注意嵌套顺序 */}
          {children || <AppRouter />}
        </QueryProvider>
        <ToasterProvider />
      </ThemeProvider>
    </ErrorBoundaryProvider>
  )
}
```

## Provider 嵌套顺序原则

1. **ErrorBoundaryProvider** - 最外层，捕获所有错误
2. **ThemeProvider** - 主题提供，影响全局样式
3. **路由相关 Provider** - 如 QueryProvider、AuthProvider 等
4. **AppRouter** - 路由组件
5. **UI 相关 Provider** - 如 ToasterProvider（无需包裹 children）

## 命名规范

- **文件名**: `[Name]Provider.tsx` (PascalCase)
- **组件名**: `[Name]Provider` (PascalCase)
- **导出**: 使用具名导出 `export function`

## 示例：添加多个 Provider

```typescript
// providers/index.tsx
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundaryProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <I18nProvider>
              {children || <AppRouter />}
              <ToasterProvider />
            </I18nProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundaryProvider>
  )
}
```

## 注意事项

1. **Provider 顺序很重要** - 内层 Provider 可以使用外层 Provider 提供的功能
2. **避免过度嵌套** - 如果 Provider 很多，考虑合并相关功能的 Provider
3. **保持单一职责** - 每个 Provider 只负责一个功能
4. **添加注释** - 说明 Provider 的作用和依赖关系
