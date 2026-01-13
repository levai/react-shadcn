---
description: 添加新 Hook 工作流
---

# 添加新 Hook

## Hooks 组织原则

根据 FSD 架构，Hooks 按使用范围分为两类：

### 1. 共享 Hooks（跨功能复用）
位置：`src/shared/hooks/`

适用于：
- 通用工具类 hooks（防抖、节流、媒体查询等）
- 跨多个 features 使用的 hooks
- UI 相关的通用 hooks

### 2. 功能特定 Hooks
位置：`src/features/[feature]/hooks/`（可选）

适用于：
- 特定业务功能的 hooks
- 只在单个 feature 内使用的 hooks

**注意**：如果 hook 只在一个 feature 内使用，也可以直接放在 feature 内部，不强制创建 hooks 目录。

## 添加共享 Hook

### 步骤

1. **创建 Hook 文件**

在 `src/shared/hooks/` 下创建新文件：

```typescript
// src/shared/hooks/useThrottle.ts
import { useEffect, useRef } from 'react'

/**
 * 节流 Hook
 * 限制函数执行频率，常用于滚动、鼠标移动等事件
 * 
 * @param callback - 需要节流的函数
 * @param delay - 节流时间（毫秒），默认 300ms
 * @returns 节流后的函数
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log('滚动中...')
 * }, 300)
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastRun = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  return ((...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = now
    } else {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callback(...args)
        lastRun.current = Date.now()
      }, delay - (now - lastRun.current))
    }
  }) as T
}
```

2. **在 index.ts 中导出**

```typescript
// src/shared/hooks/index.ts
export { useThrottle } from './useThrottle'
```

3. **使用方式**

```typescript
import { useThrottle } from '@/shared/hooks'

const handleScroll = useThrottle(() => {
  // 处理滚动
}, 300)
```

## 添加功能特定 Hook

### 方式一：创建 hooks 目录（推荐用于多个 hooks）

```
features/
└── auth/
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── usePermissions.ts
    │   └── index.ts
    ├── ui/
    ├── api/
    └── model/
```

```typescript
// features/auth/hooks/useAuth.ts
import { useAuthStore } from '../model'
import { useEffect } from 'react'

/**
 * 认证相关 Hook
 * 封装认证状态的常用操作
 */
export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  useEffect(() => {
    // 初始化逻辑
  }, [])

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
```

```typescript
// features/auth/hooks/index.ts
export { useAuth } from './useAuth'
export { usePermissions } from './usePermissions'
```

```typescript
// features/auth/index.ts
export { useAuth, usePermissions } from './hooks'
```

### 方式二：直接在 feature 内部（推荐用于单个 hook）

如果只有一个 hook，可以直接放在 feature 根目录：

```
features/
└── auth/
    ├── useAuth.ts        # 直接放在这里
    ├── ui/
    ├── api/
    └── model/
```

```typescript
// features/auth/useAuth.ts
export function useAuth() {
  // ...
}
```

```typescript
// features/auth/index.ts
export { useAuth } from './useAuth'
```

## Hook 命名规范

1. **文件名**: `use[Name].ts` (camelCase，以 use 开头)
2. **Hook 名**: `use[Name]` (camelCase，以 use 开头)
3. **导出**: 使用具名导出 `export function`

## Hook 编写规范

1. **添加 JSDoc 注释** - 说明用途、参数、返回值、示例
2. **类型安全** - 使用 TypeScript 类型
3. **处理边界情况** - SSR、浏览器兼容性等
4. **性能优化** - 合理使用 useMemo、useCallback
5. **避免同步 setState** - 在 effect body 中不要同步调用 setState，使用异步方式（setTimeout、queueMicrotask、事件回调）

### React 最佳实践

**❌ 错误：在 effect body 中同步调用 setState**
```typescript
useEffect(() => {
  setState(newValue) // 会导致级联渲染警告
}, [])
```

**✅ 正确：使用异步方式更新状态**
```typescript
// 方式1：在 setTimeout 回调中
useEffect(() => {
  const timer = setTimeout(() => {
    setState(newValue)
  }, 0)
  return () => clearTimeout(timer)
}, [])

// 方式2：使用 queueMicrotask
useEffect(() => {
  queueMicrotask(() => {
    setState(newValue)
  })
}, [])

// 方式3：在事件监听器回调中（异步，无问题）
useEffect(() => {
  const handler = () => {
    setState(newValue) // 事件回调中调用是安全的
  }
  window.addEventListener('event', handler)
  return () => window.removeEventListener('event', handler)
}, [])
```

## 示例：完整的 Hook 模板

```typescript
import { useState, useEffect } from 'react'

/**
 * [Hook 名称]
 * [简要描述 Hook 的用途]
 * 
 * @param param1 - 参数1说明
 * @param param2 - 参数2说明（可选）
 * @returns 返回值说明
 * 
 * @example
 * ```tsx
 * const value = useExample(param1, param2)
 * ```
 */
export function useExample<T>(param1: string, param2?: number): T {
  const [state, setState] = useState<T>(() => {
    // 初始化逻辑
    return initialValue
  })

  useEffect(() => {
    // 副作用逻辑
    return () => {
      // 清理逻辑
    }
  }, [dependencies])

  return state
}
```

## Hooks 库：ahooks

项目使用 **ahooks** 作为共享 Hooks 库：

- ✅ 阿里开源，中文文档完善
- ✅ 70+ hooks，功能全面
- ✅ 企业级验证，稳定可靠
- ✅ useRequest 提供强大的数据请求能力

### 安装

```bash
npm install ahooks
```

### 集成方式

在 `src/shared/hooks/index.ts` 中统一导出：

```typescript
// 从 ahooks 重新导出常用 hooks
export {
  useDebounce,
  useThrottle,
  useLocalStorage,
  useRequest,
  useToggle,
  usePrevious,
  useClickAway,
  // ... 其他需要的 hooks
} from 'ahooks'

// 导出自定义 hooks（ahooks 中没有的）
export { useMediaQuery } from './useMediaQuery'
```

## 已实现的共享 Hooks

### useMediaQuery
监听媒体查询变化，响应式设计

```typescript
import { useMediaQuery } from '@/shared/hooks'

const isDesktop = useMediaQuery('(min-width: 1024px)')
const isMobile = useMediaQuery('(max-width: 768px)')
```

### useDebounce
防抖处理，延迟更新值

```typescript
import { useDebounce } from '@/shared/hooks'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearchTerm = useDebounce(searchTerm, 300)

useEffect(() => {
  // 只在用户停止输入 300ms 后执行搜索
  search(debouncedSearchTerm)
}, [debouncedSearchTerm])
```

### useLocalStorage
同步 localStorage，支持跨标签页同步

```typescript
import { useLocalStorage } from '@/shared/hooks'

const [theme, setTheme] = useLocalStorage('theme', 'light')

// 自动同步到 localStorage
setTheme('dark')

// 支持函数式更新
setTheme(prev => prev === 'light' ? 'dark' : 'light')
```

**注意**：如果使用 usehooks-ts，这些 hooks 可以直接从库中导入，无需自定义实现。

## usehooks-ts 常用 Hooks

如果安装了 `usehooks-ts`，可以直接使用以下 hooks：

### useToggle
布尔值切换

```typescript
import { useToggle } from '@/shared/hooks'

const [isOpen, toggle, setOpen] = useToggle(false)
```

### usePrevious
获取上一次的值

```typescript
import { usePrevious } from '@/shared/hooks'

const prevValue = usePrevious(value)
```

### useWindowSize
监听窗口尺寸

```typescript
import { useWindowSize } from '@/shared/hooks'

const { width, height } = useWindowSize()
```

### useClickOutside
点击外部区域检测

```typescript
import { useClickOutside } from '@/shared/hooks'

const ref = useClickOutside(() => {
  setIsOpen(false)
})
```

### useEventListener
事件监听

```typescript
import { useEventListener } from '@/shared/hooks'

useEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    handleClose()
  }
})
```

## 更多信息

详细使用规范请参考：[Hooks 使用规范](../docs/rules/hooks.md)
