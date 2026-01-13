# ahooks 集成说明

## 安装

项目已配置使用 ahooks，请先安装依赖：

```bash
npm install ahooks
# 或
pnpm add ahooks
# 或
yarn add ahooks
```

## 已配置的 Hooks

在 `src/shared/hooks/index.ts` 中已导出以下常用 hooks：

- `useDebounce` - 防抖
- `useThrottle` - 节流
- `useLocalStorage` - localStorage
- `useSessionStorage` - sessionStorage
- `useToggle` - 布尔切换
- `usePrevious` - 上一次值
- `useClickAway` - 点击外部
- `useSize` - 元素尺寸
- `useRequest` - 数据请求（核心功能）
- `useVirtualList` - 虚拟列表
- `useInfiniteScroll` - 无限滚动
- `usePagination` - 分页管理
- `useMediaQuery` - 媒体查询（自定义）

## 使用方式

```typescript
// 统一从 @/shared/hooks 导入
import { 
  useDebounce, 
  useRequest, 
  useLocalStorage 
} from '@/shared/hooks'
```

## 更多信息

详细使用规范请查看：[Hooks 使用规范](./docs/rules/hooks.md)
