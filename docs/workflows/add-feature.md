---
description: 添加新功能模块工作流
---

# 添加新 Feature

## 步骤

### 1. 创建 Feature 目录结构

```bash
mkdir -p src/features/[feature-name]/{ui,api,model}
```

目录结构：

```
src/features/[feature-name]/
├── ui/           # UI 组件
│   ├── Component.tsx
│   └── index.ts
├── api/          # API 服务
│   ├── service.ts
│   └── index.ts
├── model/        # 状态管理
│   ├── store.ts
│   └── index.ts
└── index.ts      # 公共 API
```

### 2. 创建状态管理 (Zustand Store)

```typescript
// src/features/[name]/model/[name].store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStorageKey } from '@/shared/config'

const STORAGE_KEY = getStorageKey('[name]')

interface FeatureState {
  data: unknown
  isLoading: boolean
  setData: (data: unknown) => void
  setLoading: (loading: boolean) => void
}

export const useFeatureStore = create<FeatureState>()(
  persist(
    set => ({
      data: null,
      isLoading: false,
      setData: data => set({ data }),
      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: STORAGE_KEY,
      // 只持久化必要状态
      partialize: state => ({
        data: state.data,
      }),
      // 恢复后处理逻辑（可选）
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[Feature] store hydration error:', error)
        } else if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)
```

### 3. 创建 API 服务

```typescript
// src/features/[name]/api/[name].service.ts
import { clientHttp } from '@/shared/http'

const API = {
  LIST: '/v1/features',
  DETAIL: (id: string) => `/v1/features/${id}`,
} as const

const featureService = {
  list: async () => clientHttp.get(API.LIST),
  detail: async (id: string) => clientHttp.get(API.DETAIL(id)),
}

export default featureService
```

### 4. 创建 UI 组件

```typescript
// src/features/[name]/ui/FeatureList.tsx
export function FeatureList() {
  return <div>...</div>
}
```

### 5. 创建统一导出

```typescript
// src/features/[name]/index.ts
export { FeatureList } from './ui'
export { useFeatureStore } from './model'
export { default as featureService } from './api/[name].service'
```

## 使用方式

```typescript
import { FeatureList, useFeatureStore, featureService } from '@/features/[name]'
```
